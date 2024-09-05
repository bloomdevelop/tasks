import type { Component } from "solid-js";
import { Show } from "solid-js";
import { useRegisterSW } from "virtual:pwa-register/solid";
import "./ReloadPrompt.css";
import { FaSolidRotate, FaSolidXmark } from "solid-icons/fa";

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
    <Show when={offlineReady() || needRefresh()}>
      <div class="banner">
        <Show
          fallback={
            <>
              <span>
                A new update is available.
              </span>
              <button
                disabled={!needRefresh()}
                onClick={() => updateServiceWorker(true)}
              >
                <FaSolidRotate />
                Reload
              </button>
              <button onClick={() => close()}><FaSolidXmark/> Close</button>
            </>
          }
          when={offlineReady()}
        >
          <span>App ready to work offline</span>
          <button onClick={() => close()}><FaSolidXmark/> Close</button>
        </Show>
      </div>
    </Show>
  );
};

export default ReloadPrompt;
