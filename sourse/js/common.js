"use strict";
function eventHandler() {
	var x = window.location.host;
	let screenName;
	screenName = document.body.dataset.bg;
	if (screenName && x.includes("localhost:30")) {
		document.body.insertAdjacentHTML("beforeend", `<div class="pixel-perfect" style="background-image: url(screen/${screenName});"></div>`);
	}

	//luckyOne Js
	let headerH;
	let header = document.querySelector(".header--js");
	function calcHeaderHeight() {
		if (!header) return;
		document.documentElement.style.setProperty('--header-h', `${header.offsetHeight}px`);
		headerH = header.offsetHeight;

		window.scrollY > 0
			? header.classList.add('fixed')
			: header.classList.remove('fixed');
	}
	window.addEventListener('resize', calcHeaderHeight, { passive: true });
	window.addEventListener('scroll', calcHeaderHeight, { passive: true });
	calcHeaderHeight();

	// modal window

	//luckyone js
	let searchEngine = {
		//static
		input: document.querySelector('.search-inp-js'),
		searchBtn: document.querySelector('.search-btn-js'),
		resetBtn: document.querySelector('.show-default-js'),
		defaultContent: document.querySelector('.info-content-js'),
		searchContent: document.querySelector('.search-content-js'),
		searchMatches: document.querySelector('.search-matches-js'),

		allNumbers: [],
		contentBlocks: document.querySelectorAll('*[data-series]'),
		data: {},
		alertBox: document.querySelector('.alert-box-js'),

		//methods
		init: function () {
			this.fillData();
			//btn click
			this.searchBtn.addEventListener('click', this.render.bind(this));
			this.resetBtn.addEventListener('click', this.showDefault.bind(this));

			//input change
			//this.input.addEventListener('input', this.render.bind(this));
		},
		hideDefault: function (){
			this.defaultContent.classList.add('d-none');
			this.searchContent.classList.remove('d-none');
		},
		showDefault: function (){
			this.defaultContent.classList.remove('d-none');
			this.searchContent.classList.add('d-none');
			this.alertBox.innerHTML = '';
			this.input.value = '';
			this.searchMatches.innerHTML = '';
		},
		isEmpty: function (obj){
			for(var prop in obj) {
				if(Object.prototype.hasOwnProperty.call(obj, prop)) {
					return false;
				}
			}

			return JSON.stringify(obj) === JSON.stringify({});
		},
		findMatches: function (val){
			let getRange = this.getRange;
			let matchData = {};

			for(var series in this.data){
				let mathcesFound = [];
				let atLeastOneFound;

				for(let num of this.data[series]){
					let range = getRange(num);

					for (let item of range){
						if (String(item).indexOf(val) > -1){
							mathcesFound[num] = range;
							atLeastOneFound = true;
						}

					}
				}

				if (atLeastOneFound){
					matchData[series] = mathcesFound;
				}
			}

			if (JSON.stringify(matchData) === JSON.stringify({})){
				return undefined
			}
			else{
				return matchData;
			}
		},
		render: function (){
			let val = this.input.value;
			this.hideDefault();
			
			if (val.length < 3) {
				this.alertBox.innerHTML = '';
				this.createAlertMessage('Введіть більше 3 цифр', 'info');
				return
			}
			else{
				this.alertBox.innerHTML = '';
			}

			let matchData = this.findMatches(val);
			if(!matchData){
				this.alertBox.innerHTML = '';
				this.createAlertMessage('Збігів не виявлено', 'success');
				this.searchMatches.innerHTML = '';
				return
			}

			//clean search
			//
			//console.log(matchData);

			this.searchMatches.innerHTML = '';
			let atLeastOneFullMatch;
			console.log(matchData);
			for (var series in matchData){
				let matches = '';
				//
				for(var match in matchData[series]){
					let themeColor = 'warning';

					for (let rangeItem of matchData[series][match]){
						if(String(rangeItem) === String(val)){
							themeColor = 'danger';
							atLeastOneFullMatch = true;
						}
					}

					matches += `
					<div class="col-auto">
						<div class="sContent__number border-${themeColor} bg-${themeColor} fw-700">
							${match}
						</div>
					</div>`;
				}

				let seriesBox = `
					<div class="sContent__content-block mb-5">
						<div class="sContent__series-title">Серії <strong>${series}</strong></div>
						<div class="row gx-2 gy-2">
							${matches}
						</div>
					</div>
				`;

				this.searchMatches.innerHTML += seriesBox;
			}

			if(atLeastOneFullMatch){
				this.createAlertMessage('Знайдено повний збіг!', 'danger')
			}
			else{
				this.createAlertMessage('Знайдено частковий збіг!', 'warning')
			}
		},
		createAlertMessage: function (txt, theme='info', ableToClose=true){
			let alert = document.createElement('div');
			alert.classList.add('alert', `alert-${theme}`);
			alert.innerHTML = txt;

			if(ableToClose){
				let cross = document.createElement('div');
				cross.classList.add('alert-cross');
				alert.appendChild(cross);

				cross.addEventListener('click', function (){
					this.parentElement.remove();
				});
			}

			this.alertBox.appendChild(alert);
		},
		getRange: function (num){
			// check if its range

			//its not a range
			if(num.indexOf('-') <= -1){
				return [Number(num)]
			}
			else{
				let split = num.match(/\w+/g);
				// let from = Number(split[0]);
				// let to = Number(split[1]);

				let result = [];
				for(var i = Number(split[0]); i <= Number(split[1]); i++){
					//??
					while (String(i).length < 6){
						i = '0'+i;
					}
					result.push(i);
				}
				return result;
			}

			// test of getRange
			// console.log(getRange('093441-093600'));
			// console.log(getRange('093441'));
		},
		fillData: function (){
			for (let block of this.contentBlocks){
				let numbersContainers = block.querySelectorAll('.number-js');
				this.allNumbers.push(numbersContainers);

				let numbers = [];
				for(let number of numbersContainers){
					numbers.push(number.innerHTML.trim());
				}

				this.data[block.getAttribute('data-series')] = numbers;
			}
		}
	};
	searchEngine.init();
	//end luckyone js

};
if (document.readyState !== 'loading') {
	eventHandler();
} else {
	document.addEventListener('DOMContentLoaded', eventHandler);
}