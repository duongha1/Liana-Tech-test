const api = "https://5f57af681a07d600167e72d2.mockapi.io/api/";

function Validator(options) {
	let formElement = document.querySelector(options.form);
	let selectorRules = {};

	const validate = (inputElement, rule) => {
		let errMess;
		let errElement = inputElement.parentElement.querySelector(
			options.errElement
		);
		//get rules from selector
		let rules = selectorRules[rule.selector];
		//check each rule
		for (let i = 0; i < rules.length; i++) {
			errMess = rules[i](inputElement.value);
			if (errMess) break;
		}

		if (errMess) {
			errElement.innerText = errMess;
			inputElement.parentElement.classList.add("invalid");
		} else {
			errElement.innerText = "";
			inputElement.parentElement.classList.remove("invalid");
		}
		return !errMess;
	};

	if (formElement) {
		formElement.onsubmit = (event) => {
			event.preventDefault();
			let isFormValid = false;
			let inputElementList = [];
			options.rules.forEach((rule) => {
				inputElement = formElement.querySelector(rule.selector);
				inputElementList.push(inputElement);
				let isValid = validate(inputElement, rule);
				if (isValid) isFormValid = !isFormValid;
			});

			if (isFormValid) {
				if (typeof options.onSubmit === "function") {
					let validEmail = formElement.querySelector("#email").value;
					options.onSubmit({ email: validEmail }, api, inputElementList);
				}
			}
		};

		options.rules.forEach((rule) => {
			if (Array.isArray(selectorRules[rule.selector])) {
				selectorRules[rule.selector].push(rule.test);
			} else {
				selectorRules[rule.selector] = [rule.test];
			}

			let inputElement = formElement.querySelector(rule.selector);
			if (inputElement) {
				inputElement.onblur = () => {
					validate(inputElement, rule);
				};

				inputElement.oninput = () => {
					let errElement = inputElement.parentElement.querySelector(
						options.errElement
					);
					errElement.innerText = "";
					inputElement.parentElement.classList.remove("invalid");
				};
			}
		});
	}
}

Validator.isRequired = (selector) => {
	return {
		selector: selector,
		test: (value) => {
			return value.trim() ? "" : "This field is required";
		},
	};
};
Validator.isEmail = (selector) => {
	return {
		selector: selector,
		test: (value) => {
			const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
			return regex.test(value) ? "" : "Email is not valid";
		},
	};
};
Validator.isConfirmed = (selector, getConfirmValue) => {
	return {
		selector: selector,
		test: (value) => {
			return value === getConfirmValue() ? "" : "Confirm email is not matching";
		},
	};
};
