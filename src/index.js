const rows = document.querySelector("#rows");
const cols = document.querySelector("#cols");
const button = document.querySelector("#btn-create");
const bntCalc = document.querySelector('#calc');
const matrix = document.querySelector("#matrix");

const table = document.querySelector('#table');
let rowN = 0, colN = 0;

function createTable(row, col) {
	matrix.removeAttribute('hidden');

	const tbody = document.createElement("tbody");
	table.appendChild(tbody);
	for(let i = 0; i < row; i++) {
		const tr = document.createElement('tr');
		for(let j = 0; j < col; j++) {
			const td = document.createElement('td');
			if(i === 0 && j === 0) {
				td.innerHTML = 'Fuente/Destino';
			} else if(i === 0 && j > 0) {
				/* titulos aca */
				if(j !== col - 1) {
					td.innerHTML = `Destino ${j}`;
				} else {
					td.innerHTML = 'Oferta';
				}
			} else if (j === 0) {
				if(i === row - 1) {
					td.innerHTML = 'Demanda';
				} else {
					td.innerHTML = `Fuente ${i}`;
				}
			} else if(i === row - 1 && j === col - 1) {
				td.innerHTML = '';
			}else {
				const input = document.createElement("input");
				input.type = i === 0 || j === 0 ? "text" : "number";
				input.step = "any";
				// input.value = i === 0 && j === col - 1 ? "Demanda" : i === row - 1 && j === 0 ? "Oferta" : "";
				input.classList.add("form-control");
				td.appendChild(input);
			}
			tr.appendChild(td);
		}
		tbody.appendChild(tr);
	}
}

function getSize(event) {
	rowN = rows.value;
	colN = cols.value;

	if(rowN >= 4 && colN >= 4) {
		createTable(rowN, colN);
	}
}

function getCalc(event) {
	let initM = getMatrix();
	let oferta = 0, demanda = 0;
	const zeros = [];

	for (let i = 0; i < rowN - 1; i++) {
		const tmp = [];
		for (let j = 0; j < colN - 1; j++) {
			tmp.push(0);
			if(i !== rowN - 2 && j === colN - 2) {
				oferta += initM[i][j];
				tmp[j] = initM[i][j];
			}

			if(i === rowN - 2 && j !== colN - 2) {
				demanda += initM[i][j];
				tmp[j] = initM[i][j];
			}
		}
		zeros.push(tmp);
	}

	console.log(oferta, demanda);

	if(oferta > demanda) {
		zeros.forEach((value, index, array) => {
			value.splice(colN - 2, 0, index === rowN - 2 ? oferta - demanda: 0);
		});

		initM.forEach((value, index, array) => {
			value.splice(colN - 2, 0, index === rowN - 2 ? oferta - demanda: 0);
		});
	} else if(oferta < demanda) {
		const tmp = [];
		for (let i = 0; i < colN - 1; i++) {
			const val = i !== colN - 2 ? 0 : demanda - oferta;
			tmp.push(val);
		}
		zeros.splice(rowN - 2, 0, tmp);
		initM.splice(rowN - 2, 0, tmp);
	}

	console.log(initM);
	console.log(zeros);
}

function getMatrix() {
	let data = [];
	for(let i = 1; i < rowN; i++) {
		const tmp = [];
		for(let j = 1; j < colN; j++) {
			if(i !== rowN - 1 || j !== colN - 1) {
				const value = table.rows[i].cells[j].querySelector("input");
				// const val = value.value !== undefined ? value.value : "0";
				let val = value.value !== '' ? value.value : "0";
				tmp.push(Number(val));
			} else {
				tmp.push(0);
				// console.log(i, j);
			}
		}
		data.push(tmp);
	}
	return data;
}

button.addEventListener('click', getSize);
bntCalc.addEventListener('click', getCalc);

console.info(table);
