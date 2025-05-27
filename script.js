  document.querySelector('.cta').addEventListener('click', () => {
  document.getElementById('questionnaire').scrollIntoView({ behavior: 'smooth' });
});

document.getElementById('cycleForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const phase = this.phase.value;
  const energy = this.energy.value;
  const focus = this.focus.value;

  let tips = "";

  if (phase === "menstrual") {
    tips = "🩸 Rest, reflect & journal. Plan low-energy tasks.";
  } else if (phase === "follicular") {
    tips = "🌱 Start new projects. Brainstorm. Energy is rising!";
  } else if (phase === "ovulatory") {
    tips = "🔥 High-energy zone! Schedule meetings, pitch, lead!";
  } else if (phase === "luteal") {
    tips = "🌙 Slow down. Wrap things up, organize, declutter.";
  }

  document.getElementById("results").innerHTML = `
    <h3>Your Tips:</h3>
    <p>${tips}</p>
    <p>Energy: ${energy}/10 &nbsp; | &nbsp; Focus: ${focus}/10</p>
  `;
});
