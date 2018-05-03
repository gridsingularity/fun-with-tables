import React, { Component } from 'react';
import * as d3 from "d3";

export default class extends Component {
  componentDidMount() {
    d3.json("data/tweets.json", (error, data) => {
      if(error){
        console.log(error);
      }else {
        this.dataViz(data.tweets);
      }
    });
  }

  dataViz(incomingData) {
    incomingData.forEach(d => {
      d.impact = d.favorites.length + d.retweets.length;
      d.tweetTime = new Date(d.timestamp);
    });

    const maxImpact = d3.max(incomingData, d => d.impact);
    var startEnd = d3.extent(incomingData, d => d.tweetTime);
    var timeRamp = d3.scaleTime().domain(startEnd).range([20,480]);
    var yScale = d3.scaleLinear().domain([0,maxImpact]).range([0,460]);

    var radiusScale = d3.scaleLinear()
    .domain([0,maxImpact]).range([1,20]);

    var colorScale = d3.scaleLinear()
    .domain([0,maxImpact]).range(["white","purple"])

    d3.select(this.refs.fungraph)
      .selectAll("g")
      .data(incomingData)
      .enter()
      .append("circle")
        .attr("r", d => radiusScale(d.impact))
        .attr("cx", d => timeRamp(d.tweetTime))
        .attr("cy", d => 480 - yScale(d.impact))
        .style("fill", d => colorScale(d.impact))
        .style("stroke", "black")
        .style("stroke-width", "1px");
  }

  render() {
    return (
      <svg width="100%" height="100vh" ref="fungraph"/>
    );
  }
}
