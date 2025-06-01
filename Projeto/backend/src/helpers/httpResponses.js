export const ok = (body) => ({
  success: true,
  statusCode: 200,
  body,
});

export const created = (body) => ({
  success: true,
  statusCode: 201,
  body,
});

export const notFound = (message = 'Recurso não encontrado') => ({
  success: false,
  statusCode: 404,
  body: { message },
});

export const badRequest = (message = 'Requisição inválida') => ({
  success: false,
  statusCode: 400,
  body: { message },
});

export const unauthorized = (message = 'Não autorizado') => ({
  success: false,
  statusCode: 401,
  body: { message },
});

export const forbidden = (message = 'Acesso negado') => ({
  success: false,
  statusCode: 403,
  body: { message },
});

export const serverError = (message = 'Erro interno do servidor') => ({
  success: false,
  statusCode: 500,
  body: { message },
});