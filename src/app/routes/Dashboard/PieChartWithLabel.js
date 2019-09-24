import React, { Component } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Legend } from 'recharts';


const COLORS = ['#0088FE', '#FF8042'];

const data01 = [
  {
    "name": "Answered",
    "value": 500
  },
  {
    "name": "Unanswered",
    "value": 600
  },
];

const style = {
  margin: "20px"
};

class PieChartWithLabel extends Component {
  render() {
    return (
      <div>
        <div className="row">
          <div></div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart width={730} height={250}>
            <Pie data={data01}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={100}
              fill="#3367d6"
              paddingAngle={5} >
              {
                data01.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)
              }</Pie>
            <Legend verticalAlign="top" height={30} align='center' iconSize={25} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  }
}

export default PieChartWithLabel;
