"use client";

import CodeMirror from "@uiw/react-codemirror";
import { json } from "@codemirror/lang-json";
import { EditorView } from "@codemirror/view";
import { oneDark } from "@codemirror/theme-one-dark";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import styles from "./interactiveStudio.module.css";
import { StudioErrorBoundary } from "./interactiveStudioErrorBoundary";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import * as examples from "@versa/examples";
import { Org as Merchant, Org, Receipt } from "@versa/schema";
import {
  ChevronDown,
  Layout,
  Maximize,
  Maximize2,
  Minimize,
  RotateCw,
  Sidebar,
} from "react-feather";
import { formatDateTime, formatUSD } from "@versa/belt";
import { useValidator } from "../hooks/useValidator";
import {
  Advisory,
  BrokenReceipt,
  ReceiptDisplay,
  ReceiptErrorBoundary,
  VersaContext,
} from "@versa/react";
import { ThemeToggle } from "@/components/theme/themeToggle";

interface Receiver {
  name: string;
  logo: string;
  logo_dark: string;
}
interface OutputUnit {
  keyword: string;
  keywordLocation: string;
  instanceLocation: string;
  error: string;
}

function onBlurFormat(setValue: (value: string) => void) {
  return EditorView.domEventHandlers({
    blur: (event, view) => {
      try {
        const text = view.state.doc.toString();
        const parsed = JSON.parse(text);
        const pretty = JSON.stringify(parsed, null, 2);
        setValue(pretty);
      } catch {
        // ignore if invalid JSON
      }
    },
  });
}

export const InteractiveStudio = ({ org }: { org?: Org }) => {
  const [viewCode, setViewCode] = useState(true);

  const [clientLoaded, setClientLoaded] = useState(false);
  const [runtimeError, setRuntimeError] = useState<string | null>(null);
  const [schemaErrors, setSchemaErrors] = useState<OutputUnit[]>([]);
  const [semvalWarnings, setSemvalWarnings] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState("narrow");
  const searchParams = useSearchParams();

  const receipt = (searchParams.get("receipt") ||
    "simple") as keyof typeof examples.receipts;
  const previousReceipt = searchParams.get(
    "previousReceipt"
  ) as keyof typeof examples.receipts;
  const loadInQuery = searchParams.get(
    "loadIn"
  ) as keyof typeof examples.receipts;
  const senderKey = (searchParams.get("sender") ||
    "generic") as keyof typeof examples.senders;
  const receiverKey = (searchParams.get("receiver") ||
    "acme") as keyof typeof examples.receivers;

  const runSemval = (body: string) => {
    // Note that this requires that the semval module be
    // deployed at a NextJS API route matching this path.
    try {
      fetch("/api/semval", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body,
      })
        .then((res) => res.json())
        .then((data) => {
          setSemvalWarnings(data.violations);
        });
    } catch (e: any) {
      setRuntimeError(e.message);
    }
  };

  const defaultData = examples.receipts[receipt];
  const defaultMerchant = org
    ? {
        id: "org_example",
        name: org.name,
        brand_color: org.brand_color || "#000000",
        logo: org.logo,
      }
    : examples.senders[senderKey] || examples.senders.generic;

  const receiver: Receiver = examples.receivers[receiverKey];

  if (!defaultData) {
    console.error("Invalid receipt:", receipt);
  }

  const startingReceipt = JSON.stringify(defaultData, undefined, 2);
  const startingMerchant = JSON.stringify(defaultMerchant, undefined, 2);

  const [receiptData, setReceiptData] = useState<string>(startingReceipt);
  const [merchantData, setMerchantData] = useState<string>(startingMerchant);
  const [editSender, setEditSender] = useState<boolean>(false);

  useEffect(() => {
    setClientLoaded(true);
    if (receiptData) {
      validate(JSON.parse(receiptData)).then((valid) => {
        if (!valid.valid) {
          setSchemaErrors(valid.errors);
        } else {
          setSchemaErrors([]);
        }
      });
    }
  }, [setClientLoaded, loadInQuery, receiptData]);

  const { validate } = useValidator();

  const { systemTheme, theme } = useTheme();
  var simplifiedTheme = theme;
  if (simplifiedTheme == "system") {
    simplifiedTheme = systemTheme;
  }

  let parsedReceipt: Receipt | null = null;
  let previousReceiptData: Receipt | null = null;
  let parsedMerchant: Merchant | null = null;
  let breakingError = runtimeError;
  try {
    parsedReceipt = JSON.parse(receiptData);
    if (previousReceipt) {
      previousReceiptData = examples.receipts[previousReceipt] as Receipt; // TODO (temporary)
    }
    parsedMerchant = JSON.parse(merchantData);
  } catch (e: any) {
    breakingError = e.message;
  }

  if (!clientLoaded) {
    return null;
  }

  const onChange = (receiptJson: string) => {
    setRuntimeError(null);
    try {
      setReceiptData(receiptJson);
      runSemval(receiptJson);
    } catch (e: any) {
      setRuntimeError(e.message);
    }
  };

  const onChangeMerchant = (merchantJson: string) => {
    setRuntimeError(null);
    setMerchantData(merchantJson);
  };

  const advisoryErrors = breakingError ? [breakingError] : [];
  if (schemaErrors && schemaErrors.length)
    advisoryErrors.push(
      schemaErrors.reduce((msg, e) => {
        if (msg.length > 0) {
          msg += " ";
        }
        return (msg += e.error);
      }, "")
    );

  const advisoryWarnings = breakingError
    ? []
    : semvalWarnings.map(
        (w) => `${w.description}
  ${w.details ? " (" + w.details + ")" : ""}`
      );

  return (
    <div className={styles.styled}>
      <div
        className={styles.inner}
        style={{ gridTemplateColumns: viewCode ? "1fr 1fr" : "1fr" }}
      >
        {/* Code Editor */}

        {viewCode && (
          <div className={styles.editor}>
            <div
              className={styles.sender}
              onClick={() => {
                setEditSender(!editSender);
              }}
            >
              <span className={styles.from}>From:</span>
              <span className={styles.senderName}>{parsedMerchant?.name}</span>
              <ChevronDown
                size={20}
                className={`${styles.chevron} ${
                  editSender ? styles.chevronOpen : ""
                }`}
              />
            </div>
            {editSender && (
              <CodeMirror
                value={merchantData}
                onChange={onChangeMerchant}
                className={styles.codeMerchant}
                style={{ fontSize: ".875rem" }}
                theme={simplifiedTheme === "dark" ? oneDark : "light"}
                extensions={[json()]}
              />
            )}
            <CodeMirror
              className={styles.codeBody}
              value={receiptData}
              style={{ fontSize: ".875rem" }}
              extensions={[json(), onBlurFormat(setReceiptData)]}
              theme={simplifiedTheme === "dark" ? oneDark : "light"}
              onChange={onChange}
            />
          </div>
        )}

        {/* Preview */}

        <div className={styles.previewWrap}>
          <div className={styles.fullscreenToggle}>
            {viewCode ? (
              <button
                onClick={() => {
                  setViewCode(false);
                }}
              >
                <Maximize2 size={16} />
                <span className={styles.buttonLabel}>Fullscreen Preview</span>
              </button>
            ) : (
              <>
                <span>
                  <button
                    onClick={() => {
                      setViewCode(true);
                    }}
                  >
                    <Sidebar size={16} />
                    <span className={styles.buttonLabel}>
                      Interactive Editor
                    </span>
                  </button>
                </span>
                <div className={styles.previewToggle}>
                  <button
                    onClick={() => {
                      setViewMode("narrow");
                    }}
                    className={viewMode === "narrow" ? ` ${styles.active}` : ""}
                  >
                    <Minimize size={16} />
                    <span className={styles.buttonLabel}>Narrow (Mobile)</span>
                  </button>
                  <button
                    onClick={() => {
                      setViewMode("wide");
                    }}
                    className={viewMode === "wide" ? ` ${styles.active}` : ""}
                  >
                    <Maximize size={16} />
                    <span className={styles.buttonLabel}>
                      Wide (Full Page / Print)
                    </span>
                  </button>
                  <button
                    onClick={() => {
                      setViewMode("context");
                    }}
                    className={
                      viewMode === "context" ? ` ${styles.active}` : ""
                    }
                  >
                    <Layout size={16} />
                    <span className={styles.buttonLabel}>In Context (Web)</span>
                  </button>
                </div>
                <span>
                  <ThemeToggle />
                </span>
              </>
            )}
          </div>

          <StudioErrorBoundary
            bubbleErrorMessage={(e: string) => setRuntimeError(e)}
          >
            {!!parsedReceipt && !!parsedMerchant && (
              <div
                className={
                  viewCode
                    ? styles.narrow
                    : viewMode == "narrow"
                    ? styles.narrow
                    : viewMode == "wide"
                    ? styles.wide
                    : viewMode == "context"
                    ? styles.browserChrome
                    : styles.narrow
                }
              >
                {!viewCode && viewMode == "context" && (
                  <div className={styles.addressBar}>
                    <div className={styles.circle}></div>
                    <div className={styles.circle}></div>
                    <div className={styles.circle}></div>
                    <div className={styles.browserAddress}>
                      <div className={styles.site}>{receiver.name}</div>
                      <RotateCw size={14} />
                    </div>
                  </div>
                )}
                <div
                  className={
                    !viewCode && viewMode == "context"
                      ? styles.browserChromeInner
                      : ""
                  }
                >
                  {!viewCode && viewMode == "context" && (
                    <div className={styles.mockReceiver}>
                      <div className={styles.receiverLogo}>
                        <Image
                          src={receiver.logo}
                          width={100}
                          height={100}
                          alt={receiver.name}
                          className="lightMode"
                        />
                        <Image
                          src={receiver.logo_dark}
                          width={100}
                          height={100}
                          alt={receiver.name}
                          className="darkMode"
                        />
                      </div>
                      <div className={styles.transactionTitle}>
                        Transactions
                      </div>
                      {skeletonTx}
                      {skeletonTx}
                      <div className={`${styles.skeletonTx} ${styles.active}`}>
                        <div className={styles.merchantLogo}>
                          {parsedMerchant.logo && (
                            <Image
                              src={
                                (parsedReceipt.header.third_party &&
                                  parsedReceipt.header.third_party
                                    .make_primary &&
                                  parsedReceipt.header.third_party.merchant
                                    ?.logo) ||
                                parsedMerchant.logo
                              }
                              width={64}
                              height={64}
                              alt={
                                parsedReceipt.header.third_party &&
                                parsedReceipt.header.third_party.make_primary &&
                                !!parsedReceipt.header.third_party.merchant
                                  ? parsedReceipt.header.third_party.merchant
                                      .name
                                  : parsedMerchant.name
                              }
                            />
                          )}
                        </div>
                        <div className={styles.body}>
                          {parsedReceipt.header.third_party &&
                          parsedReceipt.header.third_party.make_primary &&
                          !!parsedReceipt.header.third_party.merchant ? (
                            <div className={styles.merchantText}>
                              {parsedReceipt.header.third_party.merchant.name}
                            </div>
                          ) : (
                            <div className={styles.merchantText}>
                              {parsedMerchant.name}
                            </div>
                          )}
                          <div className={styles.dateText}>
                            {formatDateTime(parsedReceipt.header.invoiced_at)}
                          </div>
                        </div>
                        <div className={styles.amountText}>
                          {formatUSD(parsedReceipt.header.total / 100)}
                        </div>
                      </div>
                      {skeletonTx}
                      {skeletonTx}
                      {skeletonTx}
                    </div>
                  )}
                  {viewCode && (
                    <div>
                      <Advisory
                        errors={advisoryErrors}
                        warnings={advisoryWarnings}
                      />
                    </div>
                  )}
                  <div className={styles.preview}>
                    <ReceiptErrorBoundary
                      receipt={parsedReceipt}
                      onError={(e) => setRuntimeError(String(e))}
                    >
                      {breakingError && <BrokenReceipt />}
                      {!breakingError && (
                        <VersaContext.Provider
                          value={{ mapbox_token: process.env.MAPBOX_TOKEN }}
                        >
                          <ReceiptDisplay
                            receipt={parsedReceipt}
                            merchant={parsedMerchant}
                            theme={simplifiedTheme}
                          />
                        </VersaContext.Provider>
                      )}
                    </ReceiptErrorBoundary>
                  </div>
                </div>
              </div>
            )}
          </StudioErrorBoundary>
          {!viewCode && viewMode == "context" && (
            <div className={styles.disclaimer}>
              Concept only. Receivers may display itemized receipt data in
              different ways.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const skeletonTx = (
  <div className={styles.skeletonTx}>
    <div className={styles.merchantLogo}></div>
    <div className={styles.body}>
      <div className={styles.merchant}></div>
      <div className={styles.date}></div>
    </div>
    <div className={styles.amount}></div>
  </div>
);

export default InteractiveStudio;
