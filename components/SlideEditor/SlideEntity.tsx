import { DragIndicator } from "@styled-icons/material";
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

const DragHandleHeight = 20;

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
		<div>
			<Entity
				// id={`entity-${props.slideIndex}-${props.entityIndex}`}
				className="entity"
				ref={self}
				style={{
					opacity: isDragging ? 0.2 : 1,
					left: `calc(${
						isDragging ? xPos : slideEntity.xPos
					}% + ${DragHandleHeight}px + 10px)`,
					top: `${isDragging ? yPos : slideEntity.yPos}%   `,
				}}
			>
				{slideEntity.type === "text" ? (
					<Text slideEntity={slideEntity} />
				) : null}
				{slideEntity.type === "image" ? (
					<div>{slideEntity.imgcontent}</div>
				) : null}
			</Entity>
			{props.editable ? (
				<DragHandleContainer
					style={{
						cursor: isDragging ? "grabbing" : "grab",
						left: `${isDragging ? xPos : slideEntity.xPos}%`,
						top: `${isDragging ? yPos : slideEntity.yPos}%`,
					}}
					onMouseDown={(e) => {
						setIsDragging(true);
						useSlideStore.setState({
							dragging: true,
						});
						e.preventDefault();
					}}
					onMouseUp={(e) => {
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

						let inBounds = isIntersecting(
							self?.current?.getBoundingClientRect(),
							//@ts-ignore
							props.slideRef?.current?.getBoundingClientRect()
						);
						if (inBounds) {
							newSlides[props.slideIndex][props.entityIndex].xPos = xPos;
							newSlides[props.slideIndex][props.entityIndex].yPos = yPos;
						}
						useSlideStore.setState({
							slides: newSlides,
							dragging: false,
						});
						e.preventDefault();
					}}
				>
					<DragIndicator
						height="20px"
						width="20px"
						style={{
							verticalAlign: "bottom",
						}}
					/>
				</DragHandleContainer>
			) : null}
		</div>
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
const DragHandleContainer = styled.div<{
	slideIndex: number;
	entityIndex: number;
}>`
	position: absolute;
	user-select: none;
	width: ${DragHandleHeight}px;
	height: ${DragHandleHeight}px;
	background-color: #d8d8d8;
	color: #7a7a7a;
	border-radius: 5px;
	opacity: 0;
	.entity:hover ~ & {
		opacity: 1;
	}
	:hover {
		opacity: 1;
	}
	transition: opacity 0.1s;
`;
