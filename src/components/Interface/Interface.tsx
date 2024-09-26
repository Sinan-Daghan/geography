import { onMount, createSignal } from "solid-js";
import "./Interface.css";

export default function Interface(props: any) {
  const [btnPass, setBtnPass] = createSignal<HTMLButtonElement | null>(null);
  const [textBox, setTextBox] = createSignal<HTMLParagraphElement | null>(null);

  onMount(() => {
    props.passInterfaceRefs({ btnPass: btnPass, textBox: textBox });
  });

  return (
    <section id="Interface">
      <p ref={setTextBox} class={props.textBoxClass}>
        {props.area?.name}
      </p>
      <button ref={setBtnPass} onClick={props.btnPassHandler}>
        pass
      </button>
    </section>
  );
}
