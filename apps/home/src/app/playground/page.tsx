import { Playground } from "./playground";
import { renderText } from "@versaprotocol/belt";

export default function Page() {
  return (
    <div>
      <h1>Playground</h1>
      {renderText()}
      <Playground />
    </div>
  );
}
