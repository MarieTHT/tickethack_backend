function checkBody( keys) {
	let isValid = true;

	for (const field of keys) {
		if (!field ) {
			isValid = false;
		}
	}

	return isValid;
}

module.exports = { checkBody };