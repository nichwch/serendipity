import { useState } from "react";
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
	const [isDragging, setIsDragging] = useState(false);
	const { slideEntity } = props;
	const { slides } = useSlideStore();
	return (
		<Entity
			style={{
				opacity: isDragging ? 0.2 : 1,
			}}
			draggable={true}
			xPos={slideEntity.xPos}
			yPos={slideEntity.yPos}
			onDragStart={(e) => {
				setIsDragging(true);
				// e.preventDefault();
			}}
			onDragEnd={(e) => {
				let newPosition = getPercentPosition(
					props.slideRef?.current?.getBoundingClientRect(),
					e.clientX,
					e.clientY
				);
				console.log(
					"drop",
					e,
					props.slideRef?.current?.getBoundingClientRect(),
					newPosition
				);

				let newSlides = [...slides];
				if (
					newPosition.xPos < 100 &&
					newPosition.xPos > 0 &&
					newPosition.yPos < 100 &&
					newPosition.yPos > 0
				) {
					newSlides[props.slideIndex][props.entityIndex].xPos =
						newPosition.xPos;
					newSlides[props.slideIndex][props.entityIndex].yPos =
						newPosition.yPos;
				}
				useSlideStore.setState({ slides: newSlides });
				setIsDragging(false);
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
