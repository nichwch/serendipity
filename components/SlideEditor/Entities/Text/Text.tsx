import { TextElement } from "../../SlideEntity";
import RichTextExample from "./RichTextEditor";

export const Text = (props: { slideEntity: TextElement }) => {
	return (
		<div>
			{props.slideEntity.content}
			{/* <RichTextExample /> */}
		</div>
	);
};
