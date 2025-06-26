Backend

The original implementation used fs.readFileSync and fs.writeFileSync for reading and writing the items.json file. This is blocking I/O and not appropriate for a Node.js server, especially if it scales or handles concurrent requests.
I replaced all blocking file operations with non-blocking, promise-based functions (fs.promises). I also centralized the logic into a utility module (utils/dataAccess.js) for better separation of concerns and reusability across routes. 
 The /api/stats route recalculated stats on every request — even if the data hadn’t changed — which becomes inefficient with a growing dataset.
To fix this, I introduced a lightweight in-memory cache and a file watcher using chokidar. Now, stats are only recomputed when the items.json file actually changes. This keeps the endpoint responsive and performant without compromising accuracy.
I added Jest + Supertest tests to validate core API behavior and edge cases. The test suite covers:
Successful listing of items with optional limit and search
Detail fetch by ID, including 404 handling
POST request creation flow, including validation failure cases
Cached stat computation correctness and behavior on file change
These tests help ensure stability, enable safe refactoring, and simulate real-world usage patterns.
The original errorHandler function used Function.constructor to dynamically execute code — which is both a security risk and a maintenance headache. I removed this entirely and replaced it with a standard Express error middleware pattern, ensuring predictable and safe error propagation.

FrontEnd 

The initial implementation of both the item list and detail components triggered fetch() calls without any cleanup logic. This led to potential memory leaks or warnings (e.g., setting state on unmounted components) during fast route changes.
To solve this, I wrapped all fetch calls with AbortController and properly aborted requests on unmount. This is a small change but crucial for long-running apps, especially when users are navigating quickly.
Originally, the frontend fetched up to 500 items in a single request and filtered client-side — which is neither scalable nor efficient.
I introduced real pagination and full server-side filtering using q, limit, and offset parameters. The frontend now manages its own pagination state, query changes reset page index, and the backend handles the search/filter logic. This improves performance and makes the UI ready for large datasets.
To further prepare the app for scalability, I added react-window to virtualize the list. This means only visible items are rendered to the DOM, significantly reducing memory and improving scroll performance, even with thousands of items.
I chose react-window for its small footprint, simplicity, and excellent support with fixed-size lists.
Instead of showing plain “Loading…” text, I added a skeleton shimmer loader that mimics the list layout. This enhances perceived performance and provides immediate visual feedback while data is being fetched.
This loader uses CSS-only animation and fits seamlessly with the react-window layout for consistency.
The original layout was hard to manage due to scattered inline styles. I replaced those with semantic class names and scoped styles using a ItemsPage.css file.
This makes the layout easier to read, responsive-friendly, and future-proof for adding themes or Tailwind, if needed.