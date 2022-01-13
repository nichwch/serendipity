import { useState } from "react";
import styled from "styled-components";
import { DarkenMedium, DarkenSlightly } from "../config/theme";
export const Slideshow = (props: { slides: any[]; initialIndex: number }) => {
	const [index, setIndex] = useState(props.initialIndex);

	return (
		<>
			<SlidesContainer>
				{index > 0 ? (
					<Slide key={index - 1} position="left">
						{props.slides[index - 1]}
					</Slide>
				) : null}
				<Slide key={index} position="center">
					{props.slides[index]}
				</Slide>
				{index < props.slides.length - 1 ? (
					<Slide key={index + 1} position="right">
						{props.slides[index + 1]}
					</Slide>
				) : null}
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
	margin: 10px;

	left: ${(props) => {
		if (props.position === "left") {
			return "-500px;";
		}
		if (props.position === "center") {
			return `${1 * (SLIDE_WIDTH + 10)}px;`;
		}
		if (props.position === "right") {
			return "calc(100vw - 100px);";
		}
	}};

	transition: left 0.5s;

	@keyframes fadein {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
	animation: fadein 0.2s;
`;

const SlidesContainer = styled.div`
	height: 500px;
	width: 100vw;
	overflow-x: hidden;
`;
