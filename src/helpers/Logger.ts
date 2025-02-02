import axios from "axios";
import { CustomContext, TaggedContext } from "../types/sharedTypes";

interface InternalError {
  code: string;
  notify: boolean;
}

export const Errors = {
  INTERNAL_SERVER_ERROR: {
    code: "INTERNAL_SERVER_ERROR",
    notify: true,
  },
  WRONG_PASSWORD: {
    code: "WRONG_PASSWORD",
    notify: false,
  },
  UNKOWN_USER: {
    code: "UNKOWN_USER",
    notify: false,
  },
  DUPLICATED_RECORD: {
    code: "DUP_RECORD",
    notify: true,
  },
  NOT_FOUND: {
    code: "NOT_FOUND",
    notify: false,
  },
  UNAUTHORIZED: {
    code: "UNAUTHORIZED",
    notify: false,
  },
  WRONG_INPUT: {
    code: "WRONG_INPUT",
    notify: false,
  },
  SMTP_ERROR: {
    code: "SMTP_ERROR",
    notify: true,
  },
  TIMEOUT: {
    code: "TIMEOUT",
    notify: false,
  },
  SESSION_EXPIRED: {
    code: "SESSION_EXPIRED",
    notify: false,
  },
  NOT_VALID_DOMAIN: {
    code: "NOT_VALID_DOMAIN",
    notify: false,
  },
};

const generateSlackCard = (
  error: InternalError,
  message: string,
  requestId: string,
  query: string
) => ({
  text: "Error en Jardin Binario.",
  blocks: [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*${message}* \n In query: _*${query}*_`,
      },
    },
    {
      type: "section",
      block_id: "errorDetails",
      text: {
        type: "mrkdwn",
        text: `_Request Id:_ <https://example.com|${requestId}> :heavy_exclamation_mark: \n\n *Error Code:*\n${error.code}`,
      },
    },
  ],
});

export const generateErrorObject = async (
  error: InternalError,
  message: string,
  ctx: CustomContext | TaggedContext
): Promise<Error> => {
  const { requestId, query } = ctx;

  if (error.notify) {
    // TODO create an HTTP abstraction module we will need to hit GitHub, LinkedIn so we'll use that abstraction for that e.g: async processRequest.
    await axios
      .post(
        String(process.env.SLACK_HOOK_URL),
        generateSlackCard(error, message, requestId, query)
      )
      .catch((err) => {
        console.error(err);
      });
  }

  return new Error(message) as Error;
};
