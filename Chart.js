var charts = document.getElementsByClassName('chart-table');

// iterate through charts
for (var c = charts.length; c--;) {

	var chart = charts[c];

	if (chart.tagName !== 'TABLE') {
		break;
	}

	var columns = {};
	var segmentKey = [];
	var headElements = chart.getElementsByTagName('th');
	var rowElements = toArray(chart.getElementsByTagName('tr')).slice(1);
	var columnCount = headElements.length - 1;

	// iterate through rows
	for (var r = rowElements.length; r--;) {
		var cellElements = rowElements[r].getElementsByTagName('td');

		// iterate through cells
		for (var n = columnCount+1; n--;) {
			var cell = cellElements[n];
			var key = headElements[n].innerHTML;
			var html = cell.innerHTML;

			if (n) {
				columns[key] || (columns[key] = []);
				columns[key].push(html);
			}
			else {
				segmentKey.push(html);
			}
		}
	}

	replaceWithHTML(
		chart,
		renderChart(columns, ' kb', segmentKey)
	);
}

function replaceWithHTML(element, html) {
	var parent = element.parentNode;
	var span = document.createElement('span');
	span.innerHTML = html;
	parent.appendChild(span);
	var newElement = span.firstChild;
	parent.replaceChild(newElement, element);
	parent.removeChild(span);
	return newElement;
}

function renderChart(data, unit, key) {

	var stacked = isStacked(data);
	var sums = sumArrays(data);
	var data_sums = sums[0];
	var data_vals = sums[1];

	data_sums.sort(function (a,b) {
		return b[1] - a[1];
	});

	var count = data_sums.length;
	var max = Math.max.apply(1, data_vals);
	var result = '<div class="chart chart-bar chart-count-' + count + '">';

	// Key

	if (key) {
		result += '<div class="key">';
		for (var n = key.length; n--;) {
			result += '<span class="stack-' + n + '">' + key[n] + '</span>';
		}
		result += '</div>';
	}

	// chart

	for (var d = count; d--;) {
		var parts = data_sums[d];
		var label = parts[0];
		var datum = parts[1];
		result += '<span class="bar' + (stacked ? '' : ' stack-0') + '" style="height:' + round(100*datum/max) + '%">';
		if (stacked) {
			for (var k = data[label].length; k--;) {
				var height = round(100*data[label][k]/datum);
				if (height) result += '<span class="stack stack-' + k + '" style="height:' + height + '%"></span>';
			}
		}
		result += '<b>' + label + '</b><i>' + Math.round(datum/1024) + unit + '</i></span>';
	}

	return result + '</div>';
}

function sumArrays(object) {
	var result = [];
	var values = [];
	for (var o in object) {
		var s = sum(object[o]);
		result.push([o, s]);
		values.push(s);
	}
	return [result, values];
}

function round(number) {
	return Math.round(number*1000)/1000;
}

function sum(array) {
	for (var s = 0, l = array.length; l--;) {
		s += parseInt(array[l],10);
	}
	return s;
}

function isStacked(object) {
	for (var o in object) {
		return object[o].length > 1;
	}
}

function toArray(collection) {
	return [].slice.call(collection);
}