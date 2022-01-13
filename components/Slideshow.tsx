import { useEffect, useState } from "react";
import styled from "styled-components";
import { DarkenMedium, DarkenSlightly } from "../config/theme";
import { CSSTransition, TransitionGroup } from "react-transition-group";

export const Slideshow = (props: { slides: any[]; initialIndex: number }) => {
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

	return (
		<>
			<SlidesContainer>
				<TransitionGroup>
					{index > 0 ? (
						<CSSTransition
							key={index - 1}
							timeout={{
								enter: 600,
								exit: 300,
							}}
							classNames="slide-anim"
						>
							<Slide key={index - 1} className="left">
								{props.slides[index - 1]}
							</Slide>
						</CSSTransition>
					) : null}
					<CSSTransition
						key={index}
						timeout={{
							enter: 600,
							exit: 300,
						}}
						classNames="slide-anim"
					>
						<Slide key={index} className="center">
							{props.slides[index]}
						</Slide>
					</CSSTransition>
					{index < props.slides.length - 1 ? (
						<CSSTransition
							key={index + 1}
							timeout={{
								enter: 600,
								exit: 300,
							}}
							classNames="slide-anim"
						>
							<Slide key={index + 1} className="right">
								{props.slides[index + 1]}
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
	background-color: ${DarkenMedium};
	border-radius: 30px;
	padding: 10px;
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
		transform: translateX(calc(((var(--slide-width) * (3 / 4)) * -1px)));
	}
	&.center {
		transform: translateX(calc(50vw - ((var(--slide-width) / 2) * 1px)));
	}
	&.right {
		transform: translateX(calc(100vw - (((var(--slide-width) / 4) * 1px))));
	}

	transition: transform 0.5s;
`;

const SlidesContainer = styled.div`
	position: relative;
	height: 600px;
	width: 100vw;
	overflow-x: hidden;
`;
