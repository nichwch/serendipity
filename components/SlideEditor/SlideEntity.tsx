import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useSlideStore } from "../../pages";
import { isIntersecting } from "../../utils/isIntersecting";
import { useMousePosition } from "../../utils/useMousePosition";
import { Text } from "./Entities/Text/Text";
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
	editable: boolean;
	deleteButtonRef: React.Ref<HTMLElement>;
}) => {
	return (
		<>
			{props.slideEntities.map((slideEntity, entityIndex) => {
				return (
					<SlideEntityRenderer
						editable={props.editable}
						key={entityIndex}
						slideEntity={slideEntity}
						entityIndex={entityIndex}
						slideIndex={props.slideIndex}
						slideRef={props.slideRef}
						deleteButtonRef={props.deleteButtonRef}
					/>
				);
			})}
		</>
	);
};

export const SlideEntityRenderer = (props: {
	editable: boolean;
	slideEntity: SlideEntity;
	entityIndex: number;
	slideIndex: number;
	slideRef: React.Ref<HTMLElement>;
	deleteButtonRef: React.Ref<HTMLElement>;
}) => {
	const [isDragging, setIsDragging] = useState(false);
	const { clientX, clientY } = useMousePosition();
	let { xPos, yPos } = getPercentPosition(
		//@ts-ignore
		props.slideRef?.current?.getBoundingClientRect(),
		clientX,
		clientY
	);
	const { slideEntity } = props;
	const { slides } = useSlideStore();
	const self = useRef<HTMLElement>(null);

	return (
		<>
			<DragHandleContainer
				style={{
					opacity: isDragging ? 0.2 : 1,
					cursor: isDragging ? "grabbing" : "grab",
					left: `${isDragging ? xPos : slideEntity.xPos}%`,
					top: `${isDragging ? yPos : slideEntity.yPos}%`,
				}}
				onMouseDown={
					props.editable
						? (e) => {
								setIsDragging(true);
								useSlideStore.setState({
									dragging: true,
								});
								e.preventDefault();
						  }
						: null
				}
				onMouseUp={
					props.editable
						? (e) => {
								setIsDragging(false);
								// check if intersecting delete button
								let overDelete = isIntersecting(
									self?.current?.getBoundingClientRect(),
									//@ts-ignore
									props.deleteButtonRef?.current?.getBoundingClientRect()
								);
								console.log("oer?", overDelete);
								if (overDelete) {
									// delete the entity
									let newSlides = [...slides];
									let newCurrentSlide = [...newSlides[props.slideIndex]];
									newCurrentSlide.splice(props.entityIndex, 1);
									newSlides[props.slideIndex] = newCurrentSlide;
									useSlideStore.setState({
										slides: newSlides,
										dragging: false,
									});
									e.preventDefault();
									return;
								}
								let newSlides = [...slides];
								if (xPos < 100 && xPos > 0 && yPos < 100 && yPos > 0) {
									newSlides[props.slideIndex][props.entityIndex].xPos = xPos;
									newSlides[props.slideIndex][props.entityIndex].yPos = yPos;
								}
								useSlideStore.setState({ slides: newSlides, dragging: false });
								e.preventDefault();
						  }
						: null
				}
			></DragHandleContainer>

			<Entity
				ref={self}
				style={{
					opacity: isDragging ? 0.2 : 1,
					left: `${isDragging ? xPos : slideEntity.xPos}%`,
					top: `calc(${isDragging ? yPos : slideEntity.yPos}% + 50px)`,
				}}
			>
				{slideEntity.type === "text" ? (
					<Text slideEntity={slideEntity} />
				) : null}
				{slideEntity.type === "image" ? <p>{slideEntity.imgcontent}</p> : null}
			</Entity>
		</>
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
	let xPos = (xSlideOffset / slideWidth) * 100 - 1;
	let yPos = (ySlideOffset / slideHeight) * 100 - 1;
	return { xPos, yPos };
}

const Entity = styled.div`
	position: absolute;
`;
const DragHandleContainer = styled.div`
	position: absolute;
	user-select: none;
	width: 50px;
	height: 50px;
	background-color: red;
`;
