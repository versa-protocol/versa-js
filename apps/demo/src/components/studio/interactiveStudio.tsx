"use client";

import { useTheme } from "next-themes";
import { ChangeEventHandler, useEffect, useState } from "react";
import styles from "./interactiveStudio.module.css";
import { StudioErrorBoundary } from "./interactiveStudioErrorBoundary";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import * as examples from "examples";
import { Org as Merchant, Org, Receipt } from "@versaprotocol/schema";
import {
  FileText,
  Layout,
  Maximize,
  Maximize2,
  Minimize,
  RotateCw,
  Sidebar,
  Smartphone,
} from "react-feather";
import { formatDateTime, formatUSD } from "@versaprotocol/belt";
import { useValidator } from "./useValidator";
import { ReceiptDisplay, VersaContext } from "@versaprotocol/react";
import { ThemeToggle } from "../theme/themeToggle";
import { Suspense } from "react";

interface Receiver {
  name: string;
  logo: string;
  logo_dark: string;
}

const InteractiveStudio = ({ org }: { org?: Org }) => {
  const [viewCode, setViewCode] = useState(true);
  const { validator } = useValidator();

  const [clientLoaded, setClientLoaded] = useState(false);
  const [runtimeError, setRuntimeError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState("narrow");
  const searchParams = useSearchParams();

  const receipt = searchParams.get("receipt") || "simple";
  const previousReceipt = searchParams.get("previousReceipt");
  const senderKey = searchParams.get("sender") || "generic";
  const receiverKey = searchParams.get("receiver") || "acme";

  useEffect(() => {
    setClientLoaded(true);
  }, [setClientLoaded]);

  const merchant = org
    ? org
    : examples.senders[senderKey] || examples.senders.generic;
  let defaultData = examples.receipts[receipt];

  const receiver = examples.receivers[receiverKey];

  if (!defaultData) {
    console.error("Invalid receipt:", receipt);
  }

  const startingReceipt = JSON.stringify(defaultData, undefined, 2);
  const startingMerchant = JSON.stringify(
    org
      ? {
          // id: org.id,
          name: org.name,
          brand_color: org.brand_color || "#000000",
          logo: org.logo,
        }
      : merchant,
    undefined,
    2
  );

  const [receiptData, setReceiptData] = useState<string>(startingReceipt);
  const [merchantData, setMerchantData] = useState<string>(startingMerchant);
  const { systemTheme, theme } = useTheme();
  var simplifiedTheme = theme;
  if (simplifiedTheme == "system") {
    simplifiedTheme = systemTheme;
  }

  let parsedReceipt: Receipt | null = null;
  let previousReceiptData: Receipt | null = null;
  let parsedMerchant: Merchant | null = null;
  let err = runtimeError;
  try {
    parsedReceipt = JSON.parse(receiptData);
    if (previousReceipt) {
      previousReceiptData = examples.receipts[previousReceipt];
    }
    parsedMerchant = JSON.parse(merchantData);
  } catch (e: any) {
    err = e.message;
  }

  if (!clientLoaded) {
    return null;
  }

  const onChange: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    setRuntimeError(null);
    try {
      if (validator) {
        const valid = validator.validate(JSON.parse(e.currentTarget.value));
        if (!valid.valid) {
          setRuntimeError(
            "Validation errors\n\n" +
              valid.errors.map((e) => JSON.stringify(e, null, 2)).join("\n")
          );
        }
      }
      setReceiptData(e.currentTarget.value);
    } catch (e: any) {
      setRuntimeError(e.message);
    }
  };
  const onChangeMerchant: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    setRuntimeError(null);
    setMerchantData(e.currentTarget.value);
  };

  return (
    <div className={styles.styled}>
      <div
        className={styles.inner}
        style={{ gridTemplateColumns: viewCode ? "1fr 1fr" : "1fr" }}
      >
        {/* Code Editor */}

        {viewCode && (
          <div className={styles.editor}>
            <details>
              <summary className={styles.sender}>From: {merchant.name}</summary>
              <textarea
                defaultValue={merchantData}
                onChange={onChangeMerchant}
                className={styles.codeTextarea}
              />
            </details>
            <textarea
              defaultValue={receiptData}
              onChange={onChange}
              className={styles.codeTextarea}
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

          {!!err && (
            <div className={styles.error}>
              <div>{err}</div>
            </div>
          )}
          <StudioErrorBoundary bubbleErrorMessage={(e) => setRuntimeError(e)}>
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
                                    .logo) ||
                                parsedMerchant.logo
                              }
                              width={64}
                              height={64}
                              alt={
                                parsedReceipt.header.third_party &&
                                parsedReceipt.header.third_party.make_primary
                                  ? parsedReceipt.header.third_party.merchant
                                      .name
                                  : parsedMerchant.name
                              }
                            />
                          )}
                        </div>
                        <div className={styles.body}>
                          {parsedReceipt.header.third_party &&
                          parsedReceipt.header.third_party.make_primary ? (
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
                  {!err && (
                    <div className={styles.preview}>
                      <VersaContext.Provider
                        value={{ mapbox_token: process.env.MAPBOX_TOKEN }}
                      >
                        <ReceiptDisplay
                          receipt={parsedReceipt}
                          merchant={parsedMerchant}
                          theme={simplifiedTheme}
                          activities={[]}
                        />
                      </VersaContext.Provider>
                    </div>
                  )}
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

export const Studio = () => (
  <Suspense>
    <InteractiveStudio />
  </Suspense>
);
