const viewportHeight = graphThreeField.clientHeight;
      const viewportWidth = graphThreeField.clientWidth

      const svgOne = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      const maxHeight = viewportHeight * 0.9;
      svgOne.setAttribute('width', viewportWidth*0.9);
      svgOne.setAttribute('height', viewportHeight*0.8);

      // console.log(data)

      let index = 0
      Object.keys(data).forEach(key => {
        
      })

const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        const tspanDate = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
        const tspanValue = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');

        circle.setAttribute('fill', 'var(--purple)');
        circle.setAttribute('stroke', 'var(--purple)');
        circle.setAttribute('cx', index * 100 + 50);
        circle.setAttribute('cy', maxHeight - data[key][1] * 10);
        circle.setAttribute('r', 5);

        text.setAttribute('font-size', '11px');
        text.setAttribute('stroke-width', '0');
        text.setAttribute('fill', 'var(--purple)');
        text.setAttribute('font-family', 'IBM Plex Mono');
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('opacity', '1');
        text.setAttribute('x', index * 100);
        text.setAttribute('y', maxHeight - data[key][0] * 10 + 15);

        tspanDate.setAttribute('x', index * 100 + 50);
        tspanDate.setAttribute('dy', '0');
        tspanDate.textContent = key;

        tspanValue.setAttribute('x', index * 100 + 50);
        tspanValue.setAttribute('dy', '15');
        tspanValue.textContent = `+${Profile.methods.formatXP(data[key][0]*1)}` //dataPoint.value.toFixed(1);

        text.appendChild(tspanDate);
        text.appendChild(tspanValue);
        group.appendChild(circle);
        group.appendChild(text);
        svgOne.appendChild(group);
        
        index++


        this.chartData = {}
        this.chartOptions = {
          responsive: true,
          width: viewportWidth * 0.9,
          height: viewportHeight * 0.8,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }

        this.chartData.labels = labels
    this.chartData.datasets = []
    this.chartData.datasets.push({
      label: 'XPs evolution',
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1,
      hoverBackgroundColor: 'rgba(75, 192, 192, 0.4)',
      hoverBorderColor: 'rgba(75, 192, 192, 1)',
      data: dataset
    })
    console.log(this.chartData)

    