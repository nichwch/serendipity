import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { DarkenMedium, DarkenSlightly } from "../config/theme";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { SlideComponent, SlideEntity } from "./SlideEditor/SlideEntity";

export const Slideshow = (props: {
	slides: SlideEntity[][];
	initialIndex: number;
}) => {
	const [index, setIndex] = useState(props.initialIndex);

	const slideLeft = () => {
		setIndex(Math.max(index - 1, 0));
	};
	const slideRight = () => {
		setIndex(Math.min(index + 1, props.slides.length - 1));
	};

	useEffect(() => {
		const handleKeypress = (evt) => {
			if (evt?.code === "ArrowRight") {
				setIndex(Math.min(index + 1, props.slides.length - 1));
			} else if (evt?.code === "ArrowLeft") {
				setIndex(Math.max(index - 1, 0));
			}
		};
		document.addEventListener("keydown", handleKeypress);
		return () => {
			document.removeEventListener("keydown", handleKeypress);
		};
	}, [index, props.slides.length]);

	const leftSlideRef = useRef<HTMLElement>(null);
	const middleSlideRef = useRef<HTMLElement>(null);
	const rightSlideRef = useRef<HTMLElement>(null);

	return (
		<>
			<SlidesContainer>
				<TransitionGroup>
					{/* left slide */}
					{index > 0 ? (
						<CSSTransition
							key={index - 1}
							timeout={{
								enter: 600,
								exit: 300,
							}}
							classNames="slide-anim"
						>
							<Slide key={index - 1} className="left" ref={leftSlideRef}>
								<SlideComponent
									slideEntities={props.slides[index - 1]}
									slideIndex={index - 1}
									slideRef={leftSlideRef}
								/>
							</Slide>
						</CSSTransition>
					) : null}
					{/* middle slide - the one that's in focus */}
					<CSSTransition
						key={index}
						timeout={{
							enter: 600,
							exit: 300,
						}}
						classNames="slide-anim"
					>
						<Slide key={index} className="center" ref={middleSlideRef}>
							<SlideComponent
								slideEntities={props.slides[index]}
								slideIndex={index}
								slideRef={middleSlideRef}
							/>
						</Slide>
					</CSSTransition>
					{/* right slide */}
					{index < props.slides.length - 1 ? (
						<CSSTransition
							key={index + 1}
							timeout={{
								enter: 600,
								exit: 300,
							}}
							classNames="slide-anim"
						>
							<Slide key={index + 1} className="right" ref={rightSlideRef}>
								<SlideComponent
									slideEntities={props.slides[index + 1]}
									slideIndex={index + 1}
									slideRef={rightSlideRef}
								/>
							</Slide>
						</CSSTransition>
					) : null}
				</TransitionGroup>
			</SlidesContainer>
			<button onClick={slideLeft}>left</button>
			<button onClick={slideRight}>right</button>
			{index}
		</>
	);
};

const Slide = styled.div`
	--slide-width: 700;

	position: absolute;
	display: inline-block;
	width: calc((var(--slide-width) * 1px));
	height: 500px;
	background-color: white;
	border-radius: 30px;
	padding: 10px;
	left: 0px;
	top: 20px;
	&.slide-anim-enter {
		opacity: 0;
	}
	&.slide-anim-enter-active {
		opacity: 1;
		transition: opacity 300ms 300ms;
	}
	&.slide-anim-exit {
		opacity: 1;
	}

	&.slide-anim-exit-active {
		opacity: 0;
		transition: opacity 300ms;
	}
	&.left {
		transform: translateX(calc(((var(--slide-width) * (5 / 6)) * -1px)));
	}
	&.center {
		transform: translateX(calc(50vw - ((var(--slide-width) / 2) * 1px)));
	}
	&.right {
		transform: translateX(calc(100vw - (((var(--slide-width) / 6) * 1px))));
	}

	transition: transform 0.5s;

	box-shadow: 0px 0px 15px 5px rgba(0, 0, 0, 0.22);
`;

const SlidesContainer = styled.div`
	position: relative;
	height: 600px;
	width: 100vw;
	overflow-x: hidden;
`;
