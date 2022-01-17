export interface SlideEntity {
	xPos: number;
	yPos: number;
	scale: number;
	type: "text" | "image";
}

export interface TextElement extends SlideEntity {
	type: "text";
}
export interface ImageElement extends SlideEntity {
	type: "image";
}

export const SlideComponent = (props: { slideEntities: SlideEntity[] }) => {
	return (
		<>
			{props.slideEntities.map((slideEntity, index) => {
				return <SlideEntityRenderer key={index} slideEntity={slideEntity} />;
			})}
		</>
	);
};

export const SlideEntityRenderer = (props: { slideEntity: SlideEntity }) => {
	return (
		<>
			{props.slideEntity?.type === "text" ? <p>text</p> : null}
			{props.slideEntity?.type === "image" ? <p>img</p> : null}
		</>
	);
};
