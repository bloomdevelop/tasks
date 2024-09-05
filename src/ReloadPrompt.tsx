import type { Component } from "solid-js";
import { Show } from "solid-js";
import { useRegisterSW } from "virtual:pwa-register/solid";
import "./ReloadPrompt.css";
import { TbDownload, TbReload, TbWifiOff, TbX } from "solid-icons/tb";

const ReloadPrompt: Component = () => {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      // eslint-disable-next-line prefer-template
      console.log("SW Registered: " + r);
    },
    onRegisterError(error) {
      console.log("SW registration error", error);
    },
  });

  const close = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  return (
    <Show when={offlineReady() || needRefresh() || true}>
      <div class="banner">
        <Show
          fallback={
            <>
              <TbDownload />
              <span>A new update is available.</span>
              <button
                disabled={!needRefresh()}
                onClick={() => updateServiceWorker(true)}
              >
                <TbReload />
                Reload
              </button>
              <button onClick={() => close()}>
                <TbX /> Close
              </button>
            </>
          }
          when={offlineReady()}
        >
          <TbWifiOff />
          <span>App ready to work offline</span>
          <button onClick={() => close()}>
            <TbX /> Close
          </button>
        </Show>
      </div>
    </Show>
  );
};

export default ReloadPrompt;
