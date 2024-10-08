import { createSignal, For, onMount, Show, Suspense } from "solid-js";
import "./App.css";
import localforage from "localforage";
import Dialog from "@corvu/dialog";
import { DropdownMenu } from "@kobalte/core/dropdown-menu";
import { injectSpeedInsights } from "@vercel/speed-insights";
import { inject } from "@vercel/analytics";
import { ToggleGroup } from "@kobalte/core/toggle-group";
import ReloadPrompt from "./ReloadPrompt";
import {
  TbAlertTriangle,
  TbInfoCircleFilled,
  TbNotes,
  TbPlus,
  TbTag,
  TbTags,
  TbTrash,
} from "solid-icons/tb";
import { TextField } from "@kobalte/core/text-field";
import createFocusTrap from "solid-focus-trap";
import { Temporal } from "temporal-polyfill";
import Titlebar from "./Titlebar";

function App() {
  const [todosSignal, setTodosSignal] = createSignal<any>();
  const [tagsSignal, setTagsSignal] = createSignal<any>();
  const [tagsInputSignal, setTagsInputSignal] = createSignal<string>("");
  const [inputSignal, setInputSignal] = createSignal<string>("");
  const [tagColorSignal, setTagColorSignal] = createSignal<string>("random");
  const [contentRef, setContentRef] = createSignal<HTMLElement | null>(null);
  createFocusTrap({
    element: contentRef,
    enabled: true,
  });

  onMount(async () => {
    inject();
    injectSpeedInsights();
    const todosData = await localforage.getItem("todos");
    const tagsData = await localforage.getItem("tags");
    if (!tagsData) {
      await localforage.setItem("tags", []);
    }
    if (!todosData) {
      await localforage.setItem("todos", []);
    }
    setTagsSignal(tagsData);
    setTodosSignal(todosData);
  });

  const createTodo = async () => {
    const todos = (await localforage.getItem("todos")) as [];
    if (todos) {
      await localforage.setItem("todos", [
        ...todos,
        {
          name: inputSignal(),
          completed: false,
          /* 
            Polyfill for Temporal to fix Javascript/Typescript's broken Date()
            See from the Igalia's blog: https://blogs.igalia.com/compilers/2020/06/23/dates-and-times-in-javascript/
            See from the proposal: https://github.com/tc39/proposal-temporal
           */
          createdAt: Temporal.Now.zonedDateTimeISO(
            Intl.DateTimeFormat().resolvedOptions().timeZone
          ).toLocaleString(navigator.language),
          tags: [],
        },
      ]);
      setTodosSignal(await localforage.getItem("todos"));
      setInputSignal("");
    }
  };

  const createTag = async (tag: string) => {
    const tags = (await localforage.getItem("tags")) as [];
    let color;
    if (tagColorSignal() === "random") {
      const rng = Math.floor(Math.random() * 7) + 1;
      switch (rng) {
        case 1:
          color = "adw-blue";
          break;
        case 2:
          color = "adw-red";
          break;
        case 3:
          color = "adw-green";
          break;
        case 4:
          color = "adw-orange";
          break;
        case 5:
          color = "adw-purple";
          break;
        case 6:
          color = "adw-yellow";
          break;
        case 7:
          color = "adw-brown";
          break;
      }
    } else {
      switch (tagColorSignal()) {
        case "blue":
          color = "adw-blue";
          break;
        case "red":
          color = "adw-red";
          break;
        case "green":
          color = "adw-green";
          break;
        case "orange":
          color = "adw-orange";
          break;
        case "purple":
          color = "adw-purple";
          break;
        case "yellow":
          color = "adw-yellow";
          break;
        case "brown":
          color = "adw-brown";
          break;
      }
    }

    if (tags) {
      await localforage.setItem("tags", [
        ...tags,
        {
          name: tag,
          color: color,
        },
      ]);
      setTagsSignal(await localforage.getItem("tags"));
      setTagsInputSignal("");
    }
  };

  const addTagToTodo = async (index: number, tag: any) => {
    const todos = (await localforage.getItem("todos")) as [];
    if (todos) {
      const updatedTodos = [...todos] as any;
      updatedTodos[index].tags.push(tag);
      await localforage.setItem("todos", updatedTodos);
      setTodosSignal(await localforage.getItem("todos"));
    }
  };

  const deleteTag = async (tagIndex: number) => {
    const tags = (await localforage.getItem("tags")) as [];
    if (tags) {
      const updatedTags = tags.filter((_, index) => index !== tagIndex);
      await localforage.setItem("tags", updatedTags);
      setTagsSignal(updatedTags);
    }
  };

  return (
    <>
      <Titlebar />
      <div class="container">
        <div class="toolbar">
          <ReloadPrompt />
          <div class="toolbar-container">
            <Dialog>
              <Dialog.Trigger class="info-btn">
                <TbInfoCircleFilled />
                Info
              </Dialog.Trigger>
              <Dialog.Portal>
                <Dialog.Overlay />
                <Dialog.Content>
                  <div class="d-grid">
                    <img src={"/appIcon.svg"} alt="App Icon" />
                    <h1>Tasks</h1>
                    <p>Developed by Bloom Perez</p>
                    <p>
                      Made with <code>corvu</code>, <code>kobalte</code>,{" "}
                      <code>solid-js</code>, <code>localforage</code> and{" "}
                      <code>solid-icons</code>
                    </p>
                  </div>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (inputSignal().length === 0) return;
                createTodo();
              }}
            >
              <input
                value={inputSignal()}
                onChange={(e) => setInputSignal(e.currentTarget.value)}
                type="text"
                style={{ "flex-grow": 1 }}
                placeholder="Add a task"
                class="input"
              />
              <button type="submit">
                <TbPlus /> Create
              </button>
            </form>
          </div>
        </div>
        <div class="todos">
          <Suspense
            fallback={<div style={{ "text-align": "center" }}>Loading...</div>}
          >
            <For
              each={todosSignal()}
              fallback={
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    "flex-direction": "column",
                    "justify-content": "center",
                    "align-items": "center",
                  }}
                >
                  <TbNotes size={50} />
                  <p>There's no tasks in this moment</p>
                </div>
              }
            >
              {(todo, index) => {
                return (
                  <div class="todo">
                    <div class="flex-row">
                      <input
                        class="circled-checkbox"
                        type="checkbox"
                        id={`todo-${index()}`}
                        checked={todo.completed}
                        onChange={() => {
                          const updatedTodos = [...todosSignal()];
                          updatedTodos[index()].completed =
                            !updatedTodos[index()].completed;
                          setTodosSignal(updatedTodos);
                          localforage.setItem("todos", updatedTodos);
                        }}
                      />
                      <div class="todo-content">
                        <div
                          style={{
                            display: "flex",
                            "flex-direction": "column",
                            gap: ".1rem",
                          }}
                        >
                          <h1>{todo.name}</h1>
                          <p class="muted">
                            {todo.createdAt ? (
                              `Created at: ${todo.createdAt}`
                            ) : (
                              <div
                                style={{
                                  display: "flex",
                                  "flex-direction": "row",
                                  "justify-content": "start",
                                  gap: ".2rem",
                                }}
                              >
                                <TbAlertTriangle
                                  style={{ "margin-top": "0.2rem" }}
                                />
                                <span>
                                  Please recreate a task as I'm making a new
                                  format migration
                                </span>
                              </div>
                            )}
                          </p>
                        </div>
                        <Show when={todo.tags.length > 0}>
                          <div
                            style={{
                              display: "flex",
                              "flex-direction": "row",
                              "flex-wrap": "wrap",
                              gap: ".5rem",
                            }}
                          >
                            <For each={todo.tags}>
                              {(tag) => {
                                return (
                                  <div
                                    style={{
                                      transition: "all 500ms ease",
                                      display: "flex",
                                      "flex-direction": "row",
                                      "align-items": "center",
                                      gap: ".4rem",
                                      "border-radius": "5px",
                                      padding: ".2rem .5rem",
                                      cursor: "pointer",
                                      "-webkit-user-select": "none",
                                      "user-select": "none",
                                      "-webkit-user-modify": "unset",
                                      "-moz-user-modify": "unset",
                                      "-moz-user-select": "none",
                                    }}
                                    onClick={async () => {
                                      const updatedTodos = [...todosSignal()];
                                      const todoIndex = index();
                                      updatedTodos[todoIndex].tags =
                                        updatedTodos[todoIndex].tags.filter(
                                          (t: { name: any }) =>
                                            t.name !== tag.name
                                        );

                                      await localforage.setItem(
                                        "todos",
                                        updatedTodos
                                      );
                                      setTodosSignal(
                                        await localforage.getItem("todos")
                                      );
                                    }}
                                    class={`${tag.color}`}
                                  >
                                    <TbTag />
                                    <p>{tag.name}</p>
                                  </div>
                                );
                              }}
                            </For>
                          </div>
                        </Show>
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        "flex-direction": "row",
                        gap: ".5rem",
                      }}
                    >
                      <DropdownMenu gutter={5}>
                        <DropdownMenu.Trigger>
                          <TbTags />
                        </DropdownMenu.Trigger>
                        <DropdownMenu.Portal>
                          <DropdownMenu.Content class="dropdown-menu__content">
                            <div
                              style={{
                                display: "flex",
                                "flex-direction": "column",
                                gap: ".3rem",
                              }}
                            >
                              <For each={tagsSignal()}>
                                {(tag, indexTag) => (
                                  <div
                                    style={{
                                      display: "flex",
                                      "flex-direction": "row",
                                      gap: ".3rem",
                                    }}
                                  >
                                    <DropdownMenu.Item
                                      style={{ "flex-grow": 1 }}
                                      class="dropdown-menu__item"
                                      onClick={() => {
                                        addTagToTodo(index(), tag);
                                      }}
                                      tabIndex={-1}
                                    >
                                      <div
                                        style={{
                                          width: "15px",
                                          height: "15px",
                                          "border-radius": "50%",
                                          display: "inline-block",
                                        }}
                                        class={`${tag.color}`}
                                      />

                                      {tag.name}
                                    </DropdownMenu.Item>
                                    <button
                                      onClick={() => {
                                        console.log(indexTag());
                                        deleteTag(indexTag());
                                      }}
                                      class="delete small"
                                      tabIndex={-1}
                                    >
                                      <TbTrash />
                                    </button>
                                  </div>
                                )}
                              </For>
                              <Show when={tagsSignal().length > 0}>
                                <DropdownMenu.Separator class="dropdown-menu__separator" />
                              </Show>
                              <form
                                style={{
                                  display: "flex",
                                  "flex-direction": "column",
                                  gap: ".4rem",
                                }}
                                onSubmit={async (e) => {
                                  e.preventDefault();
                                  createTag(tagsInputSignal());
                                }}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    "flex-direction": "row",
                                    gap: ".2rem",
                                  }}
                                >
                                  <TextField>
                                    <TextField.Input
                                      ref={setContentRef}
                                      style={{
                                        width: "100%",
                                      }}
                                      placeholder="Add new tag"
                                      type="text"
                                      value={tagsInputSignal()}
                                      onChange={(e: any) => {
                                        setTagsInputSignal(
                                          e.currentTarget.value
                                        );
                                      }}
                                    />{" "}
                                  </TextField>{" "}
                                  <button type="submit">
                                    <TbPlus />
                                  </button>
                                </div>
                                <ToggleGroup
                                  defaultValue="random"
                                  value={tagColorSignal()}
                                  onChange={(val) => setTagColorSignal(val)}
                                  style={{
                                    width: "100%",
                                    display: "flex",
                                    "flex-direction": "row",
                                    "justify-content": "space-around",
                                    "align-items": "center",
                                  }}
                                >
                                  <ToggleGroup.Item
                                    value="random"
                                    class="random togglebutton"
                                    title="Random"
                                  />
                                  <ToggleGroup.Item
                                    value="blue"
                                    title="Blue"
                                    class={"adw-blue togglebutton"}
                                  />
                                  <ToggleGroup.Item
                                    value="red"
                                    title="Red"
                                    class={"adw-red togglebutton"}
                                  />
                                  <ToggleGroup.Item
                                    value="green"
                                    title="Green"
                                    class={"adw-green togglebutton"}
                                  />
                                  <ToggleGroup.Item
                                    value="orange"
                                    title="Orange"
                                    class={"adw-orange togglebutton"}
                                  />
                                  <ToggleGroup.Item
                                    value="purple"
                                    title="Purple"
                                    class={"adw-purple togglebutton"}
                                  />
                                  <ToggleGroup.Item
                                    value="yellow"
                                    title="Yellow"
                                    class={"adw-yellow togglebutton"}
                                  />
                                  <ToggleGroup.Item
                                    value="brown"
                                    title="Brown"
                                    class={"adw-brown togglebutton"}
                                  />
                                </ToggleGroup>
                              </form>
                            </div>
                          </DropdownMenu.Content>
                        </DropdownMenu.Portal>
                      </DropdownMenu>
                      <button
                        class="delete"
                        onClick={async () => {
                          const todos = (await localforage.getItem(
                            "todos"
                          )) as [];
                          const updatedTodos = todos.filter(
                            (_, i) => i !== index()
                          );
                          setTodosSignal(updatedTodos);
                          localforage.setItem("todos", updatedTodos);
                        }}
                      >
                        <TbTrash /> Delete
                      </button>
                    </div>
                  </div>
                );
              }}
            </For>
          </Suspense>
        </div>
      </div>
    </>
  );
}

export default App;
