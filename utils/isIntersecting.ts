export const isIntersecting = (rect1: DOMRect, rect2: DOMRect): boolean => {
	if (
		rect1.top + rect1.height > rect2.top &&
		rect1.left + rect1.width > rect2.left &&
		rect1.bottom - rect1.height < rect2.bottom &&
		rect1.right - rect1.width < rect2.right
	) {
		return true;
	}
	return false;
};
