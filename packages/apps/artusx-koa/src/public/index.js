document.addEventListener('DOMContentLoaded', () => {
  const initEventSource = (url, onMessage) => {
    if (!EventSource) {
      console.error('EventSource is not supported');
      return;
    }

    const eventSource = new EventSource(url);

    // eventSource.onopen = () => {
    //   console.log('EventSource connected:', url);
    // };

    eventSource.onmessage = (event) => {
      onMessage(event.data);
    };

    eventSource.onerror = (error) => {
      console.error('EventSource error:', error);
    };

    return eventSource;
  };

  const eventSource = initEventSource('/stream', (data) => {
    console.log('Event:', data);
  });

  eventSource.onopen = () => {
    console.log('EventSource connected');
  };
});
