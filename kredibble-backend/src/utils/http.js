export class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

export const notFound = (resource = 'Resource') => new ApiError(404, `${resource} not found`);

export const asyncHandler = (handler) => (req, res, next) => {
  Promise.resolve(handler(req, res, next)).catch(next);
};

export const listResponse = (res, data) => res.json({ data, count: data.length });

export const itemResponse = (res, data) => res.json({ data });
