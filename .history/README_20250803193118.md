# COVID-19 and Life Expectancy

This project, ["COVID-19 and Life Expectancy,"](https://ezrahsieh.github.io/NarrativeVisualization/) is an interactive narrative visualization designed to illustrate the impact of the COVID-19 pandemic on global life expectancy. The visualization is implemented using D3.js and follows the Martini glass narrative structure to guide the audience through a focused story before allowing them to explore the data further.

## Overview

The visualization consists of three main scenes:
1. **Global Life Expectancy Over Time:** This scene shows the general trend of life expectancy across the world, highlighting the increase over the years and the slight drop following the COVID-19 pandemic.
2. **Decrease in Life Expectancy by Region (2019-2020):** This scene focuses on the impact of COVID-19 on different regions, displaying the decrease in life expectancy between 2019 and 2020.
3. **Life Expectancy over Time by Country:** This interactive scene allows users to explore life expectancy trends for specific countries, providing a detailed view of the data.

## Narrative Visualization Techniques

### 1. Messaging

The primary message of this visualization is to convey the significant impact of COVID-19 on life expectancy globally and regionally. It shows both the overall increasing trend in life expectancy and the disruptions caused by the pandemic.

### 2. Narrative Structure

This project follows the **Martini glass** narrative structure:
- **Guided Narrative:** The first two scenes present a guided story, leading the viewer through key points with minimal interaction.
- **Exploration:** The final scene allows users to explore the data more deeply, selecting specific countries to view detailed trends.

### 3. Visual Structure

Each scene maintains a consistent visual structure for clarity:
- **Line and Bar Charts:** Used to represent data trends and regional comparisons effectively.
- **Annotations:** Key data points are annotated to highlight significant events, such as the start of the COVID-19 pandemic.

### 4. Scenes

The visualization is divided into three scenes:
- **Scene 1:** A line graph of global life expectancy over time.
- **Scene 2:** A bar chart showing the decrease in life expectancy by region from 2019 to 2020.
- **Scene 3:** A line graph of life expectancy over time for selected countries.

### 5. Annotations

Annotations are used to emphasize critical points in the data:
- **Scene 1:** Highlights the start of the COVID-19 pandemic in 2019.
- **Scene 3:** Similar annotations are used for each country to maintain consistency.

### 6. Parameters

The key parameters include:
- **Selected Year Range:** Defines the years displayed in the charts.
- **Selected Country:** Determines which country's data is shown in the third scene.
- **Current Scene:** Tracks the currently displayed scene.

### 7. Triggers

User interactions drive changes in the visualization:
- **Next/Previous Buttons:** Navigate between scenes.
- **Country Dropdown:** Filters data for the selected country in the third scene.

## Usage

- **Go to Website**: https://ezrahsieh.github.io/NarrativeVisualization/

- **Next/Previous Buttons:** Use these buttons to navigate through the scenes.
- **Country Dropdown:** Select a country to view its life expectancy trends in the third scene.

## Dependencies

- **D3.js:** For creating the visualizations.
- **d3-annotation:** For adding annotations to the charts.

## License

This project is licensed under the MIT License.

## Acknowledgements

- The data used in this project is sourced from the World Health Organization (WHO).
- Inspiration and guidance were drawn from various D3.js tutorials and examples.

---

By following this README, users should be able to understand the purpose and structure of the project, as well as how to set it up and interact with the visualizations.



