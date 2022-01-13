import { useState } from "react";
import styled from "styled-components";
import { DarkenMedium, DarkenSlightly } from "../config/theme";
import { CSSTransition, TransitionGroup } from "react-transition-group";

export const Slideshow = (props: { slides: any[]; initialIndex: number }) => {
	const [index, setIndex] = useState(props.initialIndex);

	return (
		<>
			<SlidesContainer>
				<TransitionGroup>
					{index > 0 ? (
						<CSSTransition
							key={index - 1}
							timeout={300}
							classNames="slide-anim"
						>
							<Slide key={index - 1} position="left">
								{props.slides[index - 1]}
							</Slide>
						</CSSTransition>
					) : null}
					<CSSTransition key={index} timeout={300} classNames="slide-anim">
						<Slide key={index} position="center">
							{props.slides[index]}
						</Slide>
					</CSSTransition>
					{index < props.slides.length - 1 ? (
						<CSSTransition
							key={index + 1}
							timeout={300}
							classNames="slide-anim"
						>
							<Slide key={index + 1} position="right">
								{props.slides[index + 1]}
							</Slide>
						</CSSTransition>
					) : null}
				</TransitionGroup>
			</SlidesContainer>
			<button
				onClick={() => {
					setIndex(Math.max(index - 1, 0));
				}}
			>
				left
			</button>
			<button
				onClick={() => {
					setIndex(Math.min(index + 1, props.slides.length - 1));
				}}
			>
				right
			</button>
			{index}
		</>
	);
};

const SLIDE_WIDTH = 500;
const Slide = styled.div<{ position: "left" | "center" | "right" }>`
	position: absolute;
	display: inline-block;
	width: ${SLIDE_WIDTH}px;
	height: 400px;
	background-color: ${DarkenMedium};
	border-radius: 30px;
	padding: 10px;
	&.slide-anim-enter {
	opacity: 0;
	}
	&.slide-anim-enter-active {
	opacity: 1;
	transition: opacity 300ms;
	}
	&.slide-anim-exit {
	opacity: 1;
	}

	&.slide-anim-exit-active {
	opacity: 0;
	transition: opacity 300ms;
	}

	transform: ${(props) => {
		if (props.position === "left") return "translateX(-250px);";
		if (props.position === "center")
			return "translateX(  calc( 50vw - 250px ) ) ;";
		if (props.position === "right") return "translateX( calc(100vw - 250px) );";
	}}

	transition: transform 0.3s;




`;

const SlidesContainer = styled.div`
	height: 500px;
	width: 100vw;
	overflow-x: hidden;
`;
