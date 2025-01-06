
			const questions = [
				"Tôi thấy khó khăn để thư giãn",
				"Tôi nhận thấy mình bị khô miệng",
				"Tôi dường như không thể có được bất kỳ cảm xúc tích cực nào",
				"Tôi gặp khó khăn khi thở (ví dụ: thở gấp, khó thở khi không gắng sức)",
				"Tôi thấy khó khăn để bắt đầu làm việc",
				"Tôi có xu hướng phản ứng thái quá với các tình huống",
				"Tôi bị run (ví dụ: tay run)",
				"Tôi cảm thấy tôi sử dụng rất nhiều năng lượng cho sự lo lắng",
				"Tôi lo lắng về các tình huống có thể khiến tôi hoảng sợ và làm trò cười",
				"Tôi cảm thấy không có gì để mong đợi",
				"Tôi thấy mình dễ bị kích động",
				"Tôi thấy khó thư giãn",
				"Tôi cảm thấy chán nản và buồn rầu",
				"Tôi không thể chịu đựng bất cứ điều gì cản trở tôi tiếp tục công việc đang làm",
				"Tôi cảm thấy gần như hoảng loạn",
				"Tôi không thể cảm thấy hứng thú về bất cứ điều gì",
				"Tôi cảm thấy mình chẳng đáng làm người",
				"Tôi thấy mình khá dễ xúc động",
				"Tôi nhận thức được nhịp tim của mình khi không gắng sức (ví dụ: cảm giác tim đập nhanh)",
				"Tôi cảm thấy sợ hãi vô cớ",
				"Tôi cảm thấy cuộc sống vô nghĩa"
			];
	
			let chart;
	
			function initQuestions() {
				const questionsDiv = document.getElementById('questions');
				questions.forEach((q, index) => {
					questionsDiv.innerHTML += `
						<div class="question">
							<p><strong>${index + 1}.</strong> ${q}</p>
							<div class="options">
								${[0, 1, 2, 3].map(value => `
									<div class="option">
										<input type="radio" id="q${index}_${value}" name="q${index}" value="${value}">
										<label for="q${index}_${value}">${value}</label>
									</div>
								`).join('')}
							</div>
						</div>
					`;
				});
			}
	
			function calculateScores() {
				let depression = 0, anxiety = 0, stress = 0;
				for (let i = 0; i < 21; i++) {
					const selectedOption = document.querySelector(`input[name="q${i}"]:checked`);
					if (selectedOption) {
						const score = parseInt(selectedOption.value);
						if ([2, 4, 9, 15, 18, 20].includes(i)) depression += score;
						if ([1, 3, 6, 14, 17, 19].includes(i)) anxiety += score;
						if ([0, 5, 7, 10, 11, 13, 16].includes(i)) stress += score;
					}
				}
	
				const results = {
					date: document.getElementById('date').value,
					name: document.getElementById('name').value,
					pid: document.getElementById('pid').value,
					depression: depression * 2,
					anxiety: anxiety * 2,
					stress: stress * 2
				};
	
				displayResults(results);
				saveResults(results);
				updateChart();
			}
	
			function displayResults(results) {
				const resultsDiv = document.getElementById('results');
				resultsDiv.innerHTML = `
					<h3>Kết quả:</h3>
					<p><strong>Trầm cảm:</strong> ${results.depression} - ${getLevel(results.depression, 'depression')}</p>
					<p><strong>Lo âu:</strong> ${results.anxiety} - ${getLevel(results.anxiety, 'anxiety')}</p>
					<p><strong>Stress:</strong> ${results.stress} - ${getLevel(results.stress, 'stress')}</p>
				`;
			}
	
			function getLevel(score, type) {
				const levels = {
					depression: [0, 9, 13, 20, 27, 28],
					anxiety: [0, 7, 9, 14, 19, 20],
					stress: [0, 14, 18, 25, 33, 34]
				};
				const labels = ['Bình thường', 'Nhẹ', 'Vừa', 'Nặng', 'Rất nặng'];
				const typeLevel = levels[type];
				for (let i = 1; i < typeLevel.length; i++) {
					if (score < typeLevel[i]) return labels[i-1];
				}
				return labels[labels.length - 1];
			}
	
			function saveResults(results) {
				let savedResults = JSON.parse(localStorage.getItem('dassResults')) || [];
				savedResults.push(results);
				localStorage.setItem('dassResults', JSON.stringify(savedResults));
			}
	
			function updateChart() {
				const savedResults = JSON.parse(localStorage.getItem('dassResults')) || [];
				const ctx = document.getElementById('chart').getContext('2d');
	
				if (chart) {
					chart.destroy();
				}
	
				chart = new Chart(ctx, {
					type: 'line',
					data: {
						labels: savedResults.map(r => r.date),
						datasets: [{
							label: 'Trầm cảm',
							data: savedResults.map(r => r.depression),
							borderColor: '#e74c3c',
							fill: false
						}, {
							label: 'Lo âu',
							data: savedResults.map(r => r.anxiety),
							borderColor: '#3498db',
							fill: false
						}, {
							label: 'Stress',
							data: savedResults.map(r => r.stress),
							borderColor: '#2ecc71',
							fill: false
						}]
					},
					options: {
						responsive: true,
						title: {
							display: true,
							text: 'Điểm DASS theo thời gian',
							fontSize: 18,
							fontColor: '#333'
						},
						scales: {
							yAxes: [{
								ticks: {
									beginAtZero: true
								}
							}]
						}
					}
				});
			}
	
			function clearData() {
				localStorage.removeItem('dassResults');
				document.getElementById('results').innerHTML = '';
				document.getElementById('name').value = '';
				document.getElementById('pid').value = '';
				document.getElementById('date').value = '';
				document.querySelectorAll('input[type="radio"]').forEach(radio => radio.checked = false);
				if (chart) {
					chart.destroy();
				}
			}
	
			initQuestions();
			updateChart();