import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { DarkenMedium, DarkenSlightly } from "../config/theme";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { SlideComponent, SlideEntity } from "./SlideEditor/SlideEntity";
import { Add, TextFields, Image, Delete } from "@styled-icons/material";
import { useSlideStore } from "../pages";
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
	const deleteButtonRef = useRef<HTMLElement>(null);
	const { slides, dragging } = useSlideStore();

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
							<AnimationFrame>
								<ControlButtonContainer
									className="left"
									key={`addbutton${index - 1}`}
								>
									<ControlButton>
										<Add height="30px" width="30px" />
									</ControlButton>
								</ControlButtonContainer>
								<Slide
									onClick={slideLeft}
									key={index - 1}
									className="left"
									ref={leftSlideRef}
								>
									<SlideComponent
										slideEntities={props.slides[index - 1]}
										slideIndex={index - 1}
										slideRef={leftSlideRef}
										deleteButtonRef={deleteButtonRef}
										editable={false}
									/>
								</Slide>
							</AnimationFrame>
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
						<AnimationFrame>
							{dragging ? (
								<ControlButtonContainer
									className="center controlbutton"
									key={`addbutton${index}`}
								>
									<DeleteButton ref={deleteButtonRef}>
										<Delete height="30px" width="30px" />
									</DeleteButton>
								</ControlButtonContainer>
							) : (
								<ControlButtonContainer
									className="center controlbutton"
									key={`addbutton${index}`}
								>
									<ControlButton>
										<Add height="30px" width="30px" />
									</ControlButton>
									<HiddenControlButton
										index={1}
										onClick={() => {
											// add a text element
											let currentSlide = [...props.slides[index]];
											currentSlide.push({
												type: "text",
												content: "hello world",
												xPos: 50,
												yPos: 50,
												scale: 1,
											});
											let newSlides = [...slides];
											console.log(slides, "slides", newSlides, newSlides);
											newSlides[index] = currentSlide;
											useSlideStore.setState({ slides: newSlides });
										}}
									>
										<TextFields height="30px" width="30px" />
									</HiddenControlButton>
									<HiddenControlButton index={2}>
										{/* eslint-disable-next-line jsx-a11y/alt-text */}
										<Image height="30px" width="30px" />
									</HiddenControlButton>
								</ControlButtonContainer>
							)}
							<Slide
								key={index}
								className="center"
								ref={middleSlideRef}
								style={{
									overflow: "visible",
								}}
							>
								<SlideComponent
									slideEntities={props.slides[index]}
									slideIndex={index}
									slideRef={middleSlideRef}
									editable={true}
									deleteButtonRef={deleteButtonRef}
								/>
							</Slide>
						</AnimationFrame>
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
							<AnimationFrame>
								<ControlButtonContainer
									className="right"
									key={`addbutton${index + 1}`}
								>
									<ControlButton>
										<Add height="30px" width="30px" />
									</ControlButton>
								</ControlButtonContainer>
								<Slide
									onClick={slideRight}
									key={index + 1}
									className="right"
									ref={rightSlideRef}
								>
									<SlideComponent
										slideEntities={props.slides[index + 1]}
										slideIndex={index + 1}
										slideRef={rightSlideRef}
										deleteButtonRef={deleteButtonRef}
										editable={false}
									/>
								</Slide>
							</AnimationFrame>
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
	position: absolute;
	display: inline-block;
	width: calc((var(--slide-width) * 1px));
	height: 500px;
	background-color: white;
	border-radius: 30px;
	padding: 10px;
	left: 0px;
	top: 20px;

	transition: transform 0.5s;
	&.left {
		transform: translateX(calc(((var(--slide-width) * (5 / 6)) * -1px)));
		:hover {
			transform: translateX(
				calc(((var(--slide-width) * (5 / 6)) * -1px) + 50px)
			);
			/* transition: transform 0.2s; */
		}
	}
	&.center {
		transform: translateX(calc(50vw - ((var(--slide-width) / 2) * 1px)));
	}
	&.right {
		transform: translateX(calc(100vw - (((var(--slide-width) / 6) * 1px))));
		:hover {
			transform: translateX(
				calc(100vw - (((var(--slide-width) / 6) * 1px) + 50px))
			);
			/* transition: transform 0.2s; */
		}
	}

	box-shadow: 0px 0px 15px 5px rgba(0, 0, 0, 0.22);

	overflow: hidden;
`;

const AnimationFrame = styled.div`
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
`;

const ControlButton = styled.button`
	border: none;
	height: 30px;
	width: 30px;
	flex-grow: 0;
	flex-shrink: 0;
	background-color: #2525254c;
	transform: rotate(0deg);
	padding: 5px;
	border-radius: 50%;
	margin-bottom: 5px;
	transition: transform 0.5s;
	:hover {
		transform: rotate(360deg);
		transition: transform 1s;
	}
`;
const DeleteButton = styled.button`
	border: none;
	height: 30px;
	width: 30px;
	flex-grow: 0;
	flex-shrink: 0;
	background-color: #f7b1b1;
	color: #d47777;
	transform: rotate(0deg);
	padding: 5px;
	border-radius: 50%;
	margin-bottom: 5px;
	transition: transform 0.5s;
`;

const HiddenControlButton = styled.button<{ index: number }>`
	border: none;
	height: 30px;
	width: 30px;
	flex-grow: 0;
	flex-shrink: 0;
	background-color: #2525254c;
	padding: 5px;
	border-radius: 50%;
	margin-bottom: 5px;
	transform: translateY(${(props) => props.index * -50}px);
	display: block;
	opacity: 0;
	.controlbutton:hover > & {
		transform: translateY(0px);
		opacity: 1;
	}
	transition: opacity 0.4s, transform 0.4s;

	color: #0000007a;
	:hover {
		background-color: #252525ac;
	}
`;

const ControlButtonContainer = styled.div`
	position: absolute;
	display: flex;
	flex-direction: column;
	left: 0px;
	top: 20px;
	width: 50px;
	height: auto;

	&.left {
		transform: translateX(calc(((var(--slide-width) * (5 / 6)) * -1px)));
		opacity: 0;
	}
	&.center {
		transform: translateX(calc(50vw - ((var(--slide-width) / 2) * 1px) - 70px));
		opacity: 1;
	}
	&.right {
		transform: translateX(
			calc(100vw - (((var(--slide-width) / 6) * 1px) + 70px))
		);
		opacity: 0;
	}
	transition: transform 0.5s, opacity 0.5s ease-out;
`;

const SlidesContainer = styled.div`
	--slide-width: 700;
	position: relative;
	height: 600px;
	width: 100vw;
	overflow-x: hidden;
`;
