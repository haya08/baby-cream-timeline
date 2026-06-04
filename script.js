fetch("data.json")
  .then(res => res.json())
  .then(data => {

    // 🔥 title
    document.getElementById("title").innerText =
      `Project: ${data.project}`;

    // add a class to the title
    document.getElementById("title").classList.add("project-title");

    // 🔥 cards
    const cards = document.getElementById("cards");

    const stats = data.stats;

    const totalTasks = data.progress.length;
    const completed = data.currentStep + 1;
    const pending = totalTasks - completed;
    const deadline = stats.deadline;

    cards.innerHTML = `
      <div class="card">Total Tasks <span>${totalTasks}</span></div>
      <div class="card">Completed <span>${completed}</span></div>
      <div class="card">Pending <span>${pending}</span></div>
      <div class="card">Deadline <span>${deadline}</span></div>
    `;

    let progressPrefix = data.progress;
    for(let i = 1; i < progressPrefix.length; i++) {
      progressPrefix[i] += progressPrefix[i-1];
    }

    var currentProgress = progressPrefix[data.currentStep];

    // 🔥 plugin for center text
    const centerText = {
      id: 'centerText',
      beforeDraw(chart) {
        const { width } = chart;
        const { ctx } = chart;
        ctx.restore();
        ctx.font = "bold 24px sans-serif";
        ctx.fillStyle = "#00ffa6";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(currentProgress + "%", width / 2, chart.height / 2);
        ctx.save();
      }
    };

    // 🔥 progress chart
    new Chart(document.getElementById("progressChart"), {
      type: "doughnut",
      data: {
        datasets: [{
          data: [currentProgress, 100 - currentProgress],
          backgroundColor: ["#00ffa6", "#1a2a2f"],
          borderWidth: 0
        }]
      },
      options: {
        cutout: "75%",
        plugins: { legend: { display: false } }
      },
      plugins: [centerText]
    });

    // 🔥 status chart
    new Chart(document.getElementById("statusChart"), {
      type: "doughnut",
      data: {
        labels: ["Done", "Pending"],
        datasets: [{
          data: [data.currentStep+1, data.progress.length - data.currentStep-1],
          backgroundColor: ["#00ffa6", "#ff4d6d"],
          borderWidth: 0
        }]
      },
      options: {
        cutout: "75%",
        plugins: {
          legend: { labels: { color: "#fff" } }
        }
      }
    });

    //! 🔥 timeline
    const timeline = document.querySelector(".timeline");

    data.steps.forEach((step, index) => {
    const div = document.createElement("div");

    div.classList.add("step");

    // الحالة
    if (index < data.currentStep) {
        div.classList.add("done");
    } else if (index === data.currentStep) {
        div.classList.add("current"); // 🔥 الجديد
    } else {
        div.classList.add("pending");
    }

    const position = (index / (data.steps.length - 1)) * 100;
    div.style.left = position + "%";

    div.innerHTML = `
        <p>${step.date}</p>
        <span>${step.title}</span>
    `;

    timeline.appendChild(div);
});

// 🔥 line progress
const progressPercent =
  (data.currentStep / (data.steps.length - 1)) * 100;

document.getElementById("lineFill").style.width =
  progressPercent + "%";

  });


