"""Deterministic render of the Ganj Dareh goat survival chart.

Data: values read from Daly et al. 2021, PNAS 118:e2100901118, Fig. 2A, "All Levels"
panel (CC BY 4.0), by pixel measurement against the 0.00/0.25/0.75/1.00 gridlines.
Precision is about +/-0.02. Run: python3 render_survival_chart.py <out.png>
"""
import sys
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib import font_manager

AGES = ["½–1", "1–1½", "1½–2½", "2½–4"]
FEMALE = [0.94, 0.95, 0.74, 0.31]
MALE = [0.97, 0.77, 0.25, 0.12]

for path in font_manager.findSystemFonts():
    if "Inter-Regular" in path or "Inter-SemiBold" in path:
        font_manager.fontManager.addfont(path)
plt.rcParams.update({"font.family": "Inter", "font.size": 46})

INK, GRID, FEM, MAL, BG = "#1f2d3d", "#d9d2c3", "#c4861a", "#1f7a8c", "#fbf6ec"
fig, ax = plt.subplots(figsize=(16, 11), dpi=100)
fig.patch.set_facecolor(BG); ax.set_facecolor(BG)
x = range(len(AGES))
ax.plot(x, [v * 100 for v in FEMALE], color=FEM, lw=10, marker="o", ms=26, label="Female goats")
ax.plot(x, [v * 100 for v in MALE], color=MAL, lw=10, marker="s", ms=26, label="Male goats")
ax.set_xticks(list(x), AGES, color=INK)
ax.set_yticks([0, 25, 50, 75, 100], ["0%", "", "50%", "", "100%"], color=INK)
ax.set_ylim(0, 105); ax.set_xlim(-0.25, len(AGES) - 0.75)
ax.set_ylabel("Goats still alive", color=INK, labelpad=16)
ax.set_xlabel("Age in years", color=INK, labelpad=16)
ax.grid(axis="y", color=GRID, lw=2.5); ax.set_axisbelow(True)
for side in ("top", "right"): ax.spines[side].set_visible(False)
for side in ("left", "bottom"): ax.spines[side].set_color(INK)
ax.tick_params(colors=INK, length=0, pad=10)
ax.legend(frameon=False, loc="lower left", fontsize=46, labelcolor=INK)
fig.tight_layout(pad=1.6)
fig.savefig(sys.argv[1], facecolor=BG)
