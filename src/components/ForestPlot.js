import React, { useState } from 'react';
import _ from 'lodash';
import * as d3 from 'd3';
import { Autocomplete, DownloadSVGPlot, significantFigures } from 'ot-ui';
import { Tooltip } from '@material-ui/core';
import Help from '@material-ui/icons/Help';
import { pvalThreshold } from '../constants';

function traitFilterOptions(data, selectedCategories) {
  return _.sortBy(
    _.uniq(data.map(d => d.traitCategory)).map(d => {
      return {
        label: d,
        value: d,
        selected: selectedCategories
          ? selectedCategories.indexOf(d) >= 0
          : false,
      };
    }),
    [d => !d.selected, 'value']
  );
}

const cfg = {
  component_width: 0,
  svgW: 1650,
  plotW: 800,
  tableW: 500,
  traitnameW: 400,
  nTicks: 5,
  rowHeight: 26,
  minBoxSize: 5,
  maxBoxSize: 20,
  maxPlotHeight: 800,
  plotMargin: 100,
  treeColor: '#5A5F5F',
  evenRowColor: '#fff',
  unevenRowColor: '#f2f1f1',
};

const ForestPlot = ({
  data,
  refs,
  variantId,
  selectionHandler,
  selectedCategories,
}) => {
  const [traits, setTraits] = useState([]);
  const [update, setUpdate] = useState(false);

  // update the plot if a new trait category is selected
  React.useEffect(
    () => {
      let selectedTraits = data.filter(
        d => selectedCategories.indexOf(d.traitCategory) >= 0
      );
      return setTraits(_.sortBy(selectedTraits, ['traitCategory', 'beta']));
    },
    [data, selectedCategories]
  );

  const plot_height =
    cfg.plotMargin + traits.length * cfg.rowHeight < cfg.maxPlotHeight
      ? cfg.plotMargin + traits.length * cfg.rowHeight
      : cfg.maxPlotHeight;

  // draw the plot
  React.useEffect(
    () => {
      // color scale
      let colorScale = d3
        .scaleOrdinal()
        .domain(selectedCategories)
        .range(d3.schemeCategory10);

      // box size scale
      let boxSizeScale = d3
        .scaleLog()
        .domain(d3.extent(traits, d => d.nTotal))
        .range([cfg.minBoxSize, cfg.maxBoxSize]);

      // clear svg
      d3.select(refs.current)
        .selectAll('*')
        .remove();

      // get component width
      cfg.component_width = d3
        .select(refs.current)
        .node()
        .parentNode.parentNode.getBoundingClientRect().width;

      // make plot scrollable
      d3.select(refs.current.parentNode)
        .attr('width', cfg.component_width)
        .style('overflow', 'auto');

      // timer is needed to make sure the right component width is taken (and not the width just a few frames before resizing is finished
      d3.select(window).on('resize', d => {
        d3.timer(d => {
          setUpdate(!update);
        }, 5);
      });

      // set svg size and create group element
      const svg = d3
        .select(refs.current)
        .attr('width', cfg.svgW)
        .attr('height', traits.length * cfg.rowHeight + 3 * cfg.rowHeight)
        .append('g');

      // create table
      let table = svg.append('g').attr('id', 'forestTable');

      // clip trait name text (row width)
      svg
        .append('clipPath')
        .attr('id', 'clip1')
        .append('rect')
        .attr('height', cfg.rowHeight)
        .attr('width', cfg.traitnameW);

      // add top row
      table
        .append('g')
        .classed('topRow', true)
        .append('rect')
        .attr('height', cfg.rowHeight)
        .attr('width', cfg.tableW)
        .attr('fill', cfg.unevenRowColor);

      // trait
      table
        .select('.topRow')
        .append('text')
        .text('Trait')
        .attr('clip-path', 'url(#clip1)')
        .style('font-size', '17px')
        .style('font-family', 'sans-serif')
        .style('font-weight', 'bold')
        .attr('dy', (cfg.rowHeight - 15) / 2 + 11)
        .attr('dx', 8);

      // pval
      table
        .select('.topRow')
        .append('text')
        .text('P-value')
        .style('font-size', '17px')
        .style('font-family', 'sans-serif')
        .style('font-weight', 'bold')
        .attr('dy', (cfg.rowHeight - 15) / 2 + 11)
        .attr('dx', cfg.traitnameW + 8);

      // add horizontal line to separate toprow from other rows
      table
        .append('line')
        .attr('x2', cfg.tableW)
        .attr('y1', cfg.rowHeight)
        .attr('y2', cfg.rowHeight)
        .attr('stroke', 'black');

      // add vertical line to separate trait and pval columns
      table
        .append('line')
        .attr('x1', cfg.traitnameW)
        .attr('x2', cfg.traitnameW)
        .attr('y2', traits.length * cfg.rowHeight + cfg.rowHeight)
        .attr('stroke', 'black');

      // add rows to table
      let rows = table
        .selectAll('.row')
        .data(traits)
        .enter()
        .append('g')
        .classed('row', true)
        .attr(
          'transform',
          (d, i) => 'translate(0,' + cfg.rowHeight * (i + 1) + ')'
        );

      rows
        .append('rect')
        .attr('height', cfg.rowHeight)
        .attr('width', cfg.tableW)
        .attr(
          'fill',
          (d, i) => (i % 2 === 1 ? cfg.unevenRowColor : cfg.evenRowColor)
        );

      // trait name
      rows
        .append('text')
        .text(d => d.traitReported)
        .attr('clip-path', 'url(#clip1)')
        .style('font-size', '13px')
        .style('font-family', 'sans-serif')
        .attr('dy', (cfg.rowHeight - 15) / 2 + 11)
        .attr('dx', 8)
        .style('fill', d => colorScale(d.traitCategory))
        .append('title')
        .text(d => d.traitReported);

      // pval
      rows
        .append('text')
        .text(
          d =>
            d.pval < pvalThreshold
              ? `<${pvalThreshold}`
              : significantFigures(d.pval)
        )
        .style('font-size', '13px')
        .style('font-family', 'sans-serif')
        .attr('dy', (cfg.rowHeight - 15) / 2 + 11)
        .attr('dx', cfg.traitnameW + 8);

      // create the plot
      let plot = svg
        .append('g')
        .attr('id', 'forestPlot')
        .attr('transform', 'translate(' + cfg.tableW + ',0)');

      // set scale and axis
      const lowX = d3.min(traits, d => d.beta - 1.959964 * d.se);
      const highX = d3.max(traits, d => d.beta + 1.959964 * d.se);
      let x = d3
        .scaleLinear()
        .domain([lowX - Math.abs(0.1 * lowX), highX + Math.abs(0.1 * highX)])
        .range([0, cfg.plotW]);
      let xAxis = d3.axisBottom(x).ticks(cfg.nTicks);

      // axis label
      plot
        .append('g')
        .attr(
          'transform',
          'translate(0,' + (traits.length + 1) * cfg.rowHeight + ')'
        )
        .call(xAxis)
        .attr('class', 'axis')
        .append('g')
        .attr('transform', 'translate(0,' + (cfg.rowHeight + 10) + ')')
        .append('text')
        .text('Beta')
        .attr('fill', cfg.treeColor)
        .attr('text-anchor', 'middle')
        .attr('x', cfg.plotW / 2)
        .style('font-weight', 'bold')
        .style('font-size', 15);

      // axis color
      plot
        .select('.axis')
        .select('.domain')
        .style('stroke', cfg.treeColor);

      // axis tick color
      plot
        .select('.axis')
        .selectAll('.tick')
        .select('line')
        .style('stroke', cfg.treeColor)
        .style('stroke-opacity', d => (d === -0 ? '100%' : '50%'))
        .style('stroke-dasharray', d => (d === -0 ? 0 : 2))
        .attr('y1', -traits.length * cfg.rowHeight);

      // axis tick text color
      plot
        .select('.axis')
        .selectAll('.tick')
        .select('text')
        .style('fill', cfg.treeColor);

      // create effect size groups(trees)
      let trees = plot
        .selectAll('.tree')
        .data(traits)
        .enter()
        .append('g')
        .classed('tree', true)
        .attr(
          'transform',
          (d, i) => 'translate(0,' + (i + 1) * cfg.rowHeight + ')'
        )
        .attr('id', (d, i) => i);

      // create confidence intervals
      trees
        .append('line')
        .attr('x1', d => x(d.beta - 1.959964 * d.se))
        .attr('x2', d => x(d.beta + 1.959964 * d.se))
        .attr('y1', cfg.rowHeight / 2)
        .attr('y2', cfg.rowHeight / 2)
        .attr('stroke-width', 1)
        .attr('stroke', cfg.treeColor);

      // create boxes
      trees
        .append('rect')
        .attr('x', d => x(d.beta) - boxSizeScale(d.nTotal) / 2)
        .attr('y', d => cfg.rowHeight / 2 - boxSizeScale(d.nTotal) / 2)
        .attr('fill', cfg.treeColor)
        .attr('width', d => boxSizeScale(d.nTotal))
        .attr('height', d => boxSizeScale(d.nTotal))
        .append('title')
        .text(
          d =>
            d3.format('.3f')(d.beta) +
            ' (± ' +
            d3.format('.3f')(d.se * 1.959964) +
            ')'
        );

      // legend circles
      svg
        .selectAll('.legend_circle')
        .data(selectedCategories)
        .enter()
        .append('circle')
        .attr('cx', 20 + cfg.plotW + cfg.tableW)
        .attr('cy', function(d, i) {
          return 10 + i * 25;
        })
        .attr('r', 7)
        .style('fill', function(d) {
          return colorScale(d);
        });

      // legend text labels
      svg
        .selectAll('.legend_label')
        .data(selectedCategories)
        .enter()
        .append('text')
        .attr('x', 35 + cfg.plotW + cfg.tableW)
        .attr('y', function(d, i) {
          return 10 + i * 25;
        })
        .style('fill', function(d) {
          return colorScale(d);
        })
        .text(function(d) {
          return d;
        })
        .attr('text-anchor', 'left')
        .style('alignment-baseline', 'middle');

      // place lines on top of table for correct rendering
      table.selectAll('line').raise();
    },
    [data, traits, selectedCategories, refs, update, plot_height]
  );

  // trait selection dropdown
  let dropdown = (
    <Autocomplete
      options={traitFilterOptions(data, selectedCategories)}
      value={traitFilterOptions(data, selectedCategories).filter(
        d => d.selected
      )}
      handleSelectOption={selectionHandler}
      placeholder="Add a trait category to compare..."
      multiple
      wide
    />
  );

  // combine all elements to create the forest plot container
  return (
    <DownloadSVGPlot
      left={dropdown}
      svgContainer={refs}
      filenameStem={`${variantId}-traits`}
    >
      <div
        style={{
          width: cfg.component_width,
          height: plot_height,
          margin: 'none',
        }}
      >
        <Tooltip
          title={`The plot shows : beta for selected trait categories.`}
          placement={'top'}
          interactive={true}
        >
          <Help
            style={{
              fontSize: '1.6rem',
              paddingLeft: '0.6rem',
              color: 'rgba(0,0,0,0.54)',
              position: 'absolute',
            }}
            transform={`translate(${cfg.component_width - 40},0)`}
          />
        </Tooltip>
        <svg ref={refs} />
      </div>
    </DownloadSVGPlot>
  );
};

export default ForestPlot;
