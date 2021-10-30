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
				input.placeholder = "0";
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

	northwestCorner(initM, zeros);
}

/* esquina noroeste */
function northwestCorner(initM, zeros) {
	/* punteros en zero[0][0] */
	let i = 0, j = 0;

	/* puntero en zero[a][b], aumentar b*/
	let a = zeros.length - 1;
	let b = 0;

	/* puntero en zero[c][d], aumentar c */
	let c = 0;
	let d = zeros[0].length - 1;

	console.log(zeros[i][j]);
	console.log(zeros[a][b]);
	console.log(zeros[c][d]);

	while(b < zeros[0].length - 1 && c < zeros.length - 1) {
		const min = Math.min(zeros[a][b], zeros[c][d]);
		zeros[a][b] -= min;
		zeros[c][d] -= min;
		zeros[i][j] += min;


		if(zeros[a][b] === 0 && zeros[c][d] === 0) {
			b++;
			c++;
			i++;
			j++;
		} else if(zeros[a][b] === 0) {
			j++;
			b++
		} else if(zeros[c][d] === 0) {
			i++;
			c++;
		}
	}

	/* obtener costo */
	let cost = 0;
	for(i = 0; i < zeros.length; i++) {
		for (let j = 0; j < zeros[i].length; j++) {
			cost += zeros[i][j] * initM[i][j];
		}
	}

	console.log(zeros);
	console.log(cost);
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
