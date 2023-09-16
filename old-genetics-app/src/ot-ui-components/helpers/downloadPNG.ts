import FileSaver from 'file-saver';

const downloadPNG = ({
  canvasNode,
  filenameStem,
}: {
  canvasNode: HTMLCanvasElement;
  filenameStem: string;
}) => {
  if (!canvasNode) {
    console.info('Nothing to download.');
    return;
  }
  canvasNode.toBlob((blob) => {
    if (!blob) {
      console.error('Failed to create blob from canvas element:');
      console.error(canvasNode);
      return;
    }
    FileSaver.saveAs(blob, `${filenameStem}.png`);
  });
};

export default downloadPNG;
