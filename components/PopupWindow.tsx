import { MESSAGE_CHANNEL, MessageActions } from "@/utils/const";
import { cn } from "@/utils/index";
import {
  Check,
  CircleX,
  Clipboard,
  ExternalLink,
  RefreshCw,
} from "lucide-react";

export default function PopupWindow({
  url,
  size,
  className,
}: {
  url: string;
  size: number;
  className?: string;
}) {
  const t = browser.i18n.getMessage;
  const overflow = useRef(document.body.style.overflow); // to store the previous overflow value
  const iframe = useRef<HTMLIFrameElement>(null);

  const [copid, setCopied] = useState<boolean>(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    function handleKeydown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closePopup();
      }
    }

    window.addEventListener("keydown", handleKeydown);
    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  });
  function closePopup() {
    if (overflow.current) {
      document.body.style.overflow = overflow.current;
    } else {
      document.body.style.removeProperty("overflow");
    }
    window.postMessage(
      {
        action: MessageActions.CLOSE_IFRAME_POPUP,
        channel: MESSAGE_CHANNEL,
        url,
      },
      "*"
    );
  }
  return (
    <>
      <div
        className={cn(
          "fixed inset-0 w-screen h-screen bg-gray-900 bg-opacity-60 flex items-center justify-center overflow-hidden z-[2147483647]",
          className
        )}
      >
        <div
          className="relative"
          style={{ width: `${size}%`, height: `${size}%` }}
        >
          <div className="flex flex-col gap-1 px-2 absolute top-0 right-[-3em]">
            <div title={t("iframeActionClose")} onClick={closePopup}>
              <CircleX className="w-8 h-8 cursor-pointer text-white" />
            </div>
            <div
              title={t("iframeActionReload")}
              onClick={() => iframe.current?.contentWindow?.location.reload()}
            >
              <RefreshCw className="w-8 h-8 cursor-pointer text-white" />
            </div>
            <div
              title={t("iframeActionOpenInTab")}
              onClick={() => window.open(url)}
            >
              <ExternalLink className="w-8 h-8 cursor-pointer text-white" />
            </div>
            {copid ? (
              <div title={t("iframeActionCopied")}>
                <Check className="w-8 h-8 cursor-pointer text-white" />
              </div>
            ) : (
              <div
                title={t("iframeActionCopyLink")}
                onClick={() => {
                  navigator.clipboard.writeText(url);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
              >
                <Clipboard className="w-8 h-8 cursor-pointer text-white" />
              </div>
            )}
          </div>
          <iframe
            ref={iframe}
            src={url}
            className="w-full h-full shadow-md rounded-md overflow-auto bg-white"
          />
        </div>
      </div>
    </>
  );
}
