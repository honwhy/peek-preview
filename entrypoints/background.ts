import {
  EXT_PARAM_KEY,
  Message,
  OpenMessage,
  MessageActions,
} from "@/utils/const";
import { log } from "@/utils/index";

export default defineBackground(() => {
  browser.runtime.onMessage.addListener(
    (message: Message, sender: chrome.runtime.MessageSender) => {
      log("background received message & sender:", message, sender);
      if (message.action === MessageActions.OPEN) {
        const url = new URL((message as OpenMessage).url);
        url.searchParams.set(EXT_PARAM_KEY, "");
        browser.windows.create({
          url: url.toString(),
          type: "popup",
        });
      } else if (message.action === MessageActions.CLOSE) {
        if (sender.tab) {
          browser.windows.remove(sender.tab.windowId);
        }
      }
    }
  );
});
