// copy
const copy = (text) => {
  try {
    // const copyEvent = new ClipboardEvent('copy', {
    //   dataType: 'text/plain',
    //   data: 'text',
    // });
    // document.dispatchEvent(copyEvent);
    bindEvent(document, 'copy', function copyEvent(e) {
      e.clipboardData.setData('text/plain', text);
      e.preventDefault();
    });
    document.execCommand('copy');
    removeEvent(document, 'copy', 'copyEvent');
  } catch (err) {
    const aux = document.createElement('input');
    aux.setAttribute('value', text);
    document.body.appendChild(aux);
    aux.select();
    document.execCommand('copy');
    document.body.removeChild(aux);
  }
}

export {
  copy,
}
