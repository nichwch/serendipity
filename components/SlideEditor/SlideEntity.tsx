import { useEffect, useState } from "react";
import styled from "styled-components";
import { useSlideStore } from "../../pages";
export interface SlideInterface {
	xPos: number;
	yPos: number;
	scale: number;
}

export interface TextElement extends SlideInterface {
	type: "text";
	content: string;
}
export interface ImageElement extends SlideInterface {
	type: "image";
	imgcontent: string;
}

export type SlideEntity = TextElement | ImageElement;
const useMousePosition = () => {
	const [position, setPosition] = useState({
		clientX: 0,
		clientY: 0,
	});

	const updatePosition = (event) => {
		const { pageX, pageY, clientX, clientY } = event;

		setPosition({
			clientX,
			clientY,
		});
	};

	useEffect(() => {
		document.addEventListener("mousemove", updatePosition, false);
		document.addEventListener("mouseenter", updatePosition, false);

		return () => {
			document.removeEventListener("mousemove", updatePosition);
			document.removeEventListener("mouseenter", updatePosition);
		};
	}, []);

	return position;
};
export const SlideComponent = (props: {
	slideEntities: SlideEntity[];
	slideIndex: number;
	slideRef: React.Ref<HTMLElement>;
}) => {
	return (
		<>
			{props.slideEntities.map((slideEntity, entityIndex) => {
				return (
					<SlideEntityRenderer
						key={entityIndex}
						slideEntity={slideEntity}
						entityIndex={entityIndex}
						slideIndex={props.slideIndex}
						slideRef={props.slideRef}
					/>
				);
			})}
		</>
	);
};

export const SlideEntityRenderer = (props: {
	slideEntity: SlideEntity;
	entityIndex: number;
	slideIndex: number;

	slideRef: React.Ref<HTMLElement>;
}) => {
	const { clientX, clientY } = useMousePosition();
	let { xPos, yPos } = getPercentPosition(
		props.slideRef?.current?.getBoundingClientRect(),
		clientX,
		clientY
	);
	const [isDragging, setIsDragging] = useState(false);
	const { slideEntity } = props;
	const { slides } = useSlideStore();
	return (
		<Entity
			style={{
				opacity: isDragging ? 0.2 : 1,
			}}
			xPos={isDragging ? xPos : slideEntity.xPos}
			yPos={isDragging ? yPos : slideEntity.yPos}
			onMouseDown={(e) => {
				setIsDragging(true);
				e.preventDefault();
			}}
			onMouseUp={(e) => {
				setIsDragging(false);
				let newSlides = [...slides];
				if (xPos < 100 && xPos > 0 && yPos < 100 && yPos > 0) {
					newSlides[props.slideIndex][props.entityIndex].xPos = xPos;
					newSlides[props.slideIndex][props.entityIndex].yPos = yPos;
				}
				useSlideStore.setState({ slides: newSlides });
				e.preventDefault();
			}}
		>
			{slideEntity.type === "text" ? <p>{slideEntity.content}</p> : null}
			{slideEntity.type === "image" ? <p>{slideEntity.imgcontent}</p> : null}
		</Entity>
	);
};
// relevant link for using the correct x/y position from event:
// https://stackoverflow.com/questions/6073505/what-is-the-difference-between-screenx-y-clientx-y-and-pagex-y
// i believe clientX/clientY is what we want.

function getPercentPosition(
	boundingRect: DOMRect,
	x: number,
	y: number
): {
	xPos: number;
	yPos: number;
} {
	if (!boundingRect) {
		return { xPos: 0, yPos: 0 };
	}
	let slideWidth = boundingRect.width;
	let slideHeight = boundingRect.height;
	let xSlideOffset = x - boundingRect.left;
	let ySlideOffset = y - boundingRect.top;
	let xPos = (xSlideOffset / slideWidth) * 100;
	let yPos = (ySlideOffset / slideHeight) * 100;
	return { xPos, yPos };
}

const Entity = styled.div<{ xPos: number; yPos: number }>`
	position: absolute;
	left: ${(props) => props.xPos}%;
	top: ${(props) => props.yPos}%;

	user-select: none;
`;
