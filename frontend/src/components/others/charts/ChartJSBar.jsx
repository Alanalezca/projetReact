    import styles from './ChartJSBar.module.css';

    import {
        Chart as ChartJS,
        CategoryScale,
        LinearScale,
        BarElement,
        Title,
        Tooltip,
        Legend
    } from 'chart.js';

    import { Bar } from 'react-chartjs-2';

    ChartJS.register(
        CategoryScale,
        LinearScale,
        BarElement,
        Title,
        Tooltip,
        Legend
    );

    const ChartJSBar = ({ labels, values, colors}) => {

    const data = {
        labels: labels,
        datasets: [
            {
            label: 'Nombre de cartes',
            data: values,
            backgroundColor: colors,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Cartes validées par maison',
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                suggestedMax: 12,
                ticks: {
                    stepSize: 1
                }
            }
        }
        };

        return (
            <div>
                <Bar data={data} options={options} />
            </div>
        );
    };

    export default ChartJSBar;