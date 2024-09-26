import { createSignal, createEffect } from "solid-js";
import Interface from "~/components/Interface/Interface";
import Brazil from "~/components/Brazil/Brazil";
import "./Container.css";

interface InterfaceRefs {
  btnPass: HTMLButtonElement | null;
  textBox: HTMLParagraphElement | null;
}
interface mapData {
  [key: string]: {
    id: string;
    name: string;
    url?: string;
  };
}
const colors = {
  correct: "#00ff61",
  incorrect: "#fb1e1e",
};

export default function Container() {
  const [area, setArea]: any = createSignal<string | null>(null);
  const [mapData, setMapData] = createSignal<mapData | null>(null);
  const [hoveredPath, setHoveredPath] = createSignal<SVGPathElement | null>(
    null,
  );
  const [clickedPathAndColor, setClickedPathAndColor] = createSignal<{
    path: SVGPathElement;
    color: string;
  } | null>(null);
  let btnPass: HTMLButtonElement | null = null;
  let textBox: HTMLParagraphElement | null = null;
  const getInterfaceRefs = (refs: InterfaceRefs) => {
    btnPass = refs.btnPass;
    textBox = refs.textBox;
  };
  const [textBoxClass, setTextBoxClass] = createSignal("");

  function changeTextBoxClass(text: string) {
    setTextBoxClass("");
    setTimeout(() => {
      setTextBoxClass(text);
    }, 0);
  }

  function resetClickedPathColor() {
    const pathAndColor = clickedPathAndColor();
    if (pathAndColor) {
      const { path, color } = pathAndColor;
      path.setAttribute("fill", color);
    }
  }

  function isAnswerCorrect(id: string) {
    return id === area()?.id;
  }

  function pickRandomArea(areas: any) {
    if (!areas) return null;
    const keys = Object.keys(areas);
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    return areas[randomKey];
  }

  createEffect(() => {
    const newArea = pickRandomArea(mapData());
    if (newArea) setArea(newArea);
  });

  function btnPassHandler() {
    resetClickedPathColor();
    const data = mapData();
    if (data && Object.keys(data).length > 1) {
      let newArea;
      do {
        newArea = pickRandomArea(mapData());
      } while (newArea === area());

      setArea(newArea);
    }
  }

  function handleMouseMove(event: MouseEvent) {
    if (event.target instanceof SVGPathElement) {
      const path = event.target;
      hoveredPath()?.setAttribute("transform", "");
      path.setAttribute("transform", "translate(-0.1, -0.1)");
      setHoveredPath(path);
    } else {
      hoveredPath()?.setAttribute("transform", "");
    }
  }

  function handleMouseClick(event: MouseEvent) {
    if (event.target instanceof SVGPathElement) {
      resetClickedPathColor();
      const path = event.target;
      const pathColor = path.getAttribute("fill");

      if (isAnswerCorrect(path.id)) {
        changeTextBoxClass("correct");
        path.setAttribute("fill", colors.correct);
        setArea(pickRandomArea(mapData()));
      } else {
        changeTextBoxClass("incorrect");
        path.setAttribute("fill", colors.incorrect);
      }
      setClickedPathAndColor({
        path: path,
        color: pathColor || "black",
      });
    }
  }

  return (
    <main id="Container">
      <nav>
        <a href="/">Home</a>
      </nav>
      <Brazil
        onMouseMove={handleMouseMove}
        onMouseClick={handleMouseClick}
        setMapData={setMapData}
      />
      <Interface
        passInterfaceRefs={getInterfaceRefs}
        btnPassHandler={btnPassHandler}
        textBoxClass={textBoxClass()}
        area={area()}
      />
    </main>
  );
}
