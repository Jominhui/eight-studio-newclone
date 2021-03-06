import React, { useCallback, useEffect, useRef, useState } from "react";
import { observer } from "mobx-react";
import Game from "../../components/Game";

const GameContainer = ({}) => {
  const [page, setPage] = useState<number>(0);
  const [lastScroll, setLastScroll] = useState<number>(0);
  const [isScroll, setIsScroll] = useState<boolean>(false);
  const winHei = window.innerHeight;
  const gameRef = useRef<HTMLDivElement>(null);
  const start = 500;
  const end = 1550;

  const saFunc = useCallback(() => {
    if (document.body.getBoundingClientRect().top !== 0) {
      console.log("2");
      if (gameRef.current && gameRef.current.children) {
        for (const element of gameRef.current.children as any) {
          if (element.classList.contains("up")) {
            if (winHei > element.getBoundingClientRect().top - end) {
              element.classList.remove("up");
            }
          }
          if (!element.classList.contains("up")) {
            if (winHei > element.getBoundingClientRect().top + start) {
              element.classList.add("up");
            }
          }
          if (element.classList.contains("up")) {
            if (winHei > element.getBoundingClientRect().top + end) {
              element.classList.remove("up");
            }
          }
        }
      }
    }
  }, [gameRef]);

  useEffect(() => {
    window.addEventListener("load", saFunc);
    window.addEventListener("scroll", saFunc);
    return () => {
      window.removeEventListener("load", saFunc);
      window.removeEventListener("scroll", saFunc);
    };
  }, [saFunc]);

  const scrollCallback = useCallback(() => {
    document.body.classList.add("hidden");
    if (!isScroll) {
      setIsScroll(true);
      if (document.body.getBoundingClientRect().top < lastScroll) {
        scroll("up");
      } else {
        scroll("down");
      }
    } else {
      return;
    }
  }, [lastScroll, isScroll]);

  const scroll = useCallback(
    (value: string) => {
      if (value === "up") {
        if (page < 3) {
          setPage(page + 1);
        }
      } else if (value === "down") {
        if (page > 0) {
          setPage(page - 1);
        }
      }

      setTimeout(() => {
        setLastScroll(document.body.getBoundingClientRect().top);
        setIsScroll(false);
        document.body.classList.remove("hidden");
      }, 750);
    },
    [isScroll]
  );

  useEffect(() => {
    document.addEventListener("scroll", scrollCallback, false);
    return () => document.removeEventListener("scroll", scrollCallback, false);
  }, [scrollCallback]);

  useEffect(() => {
    console.log("Scroll");
    window.scrollTo({ top: page * winHei, behavior: "smooth" });
  }, [page]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Game gameRef={gameRef} />
    </>
  );
};

export default observer(GameContainer);
