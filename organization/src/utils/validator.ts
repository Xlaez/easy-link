class Validator {
    constructor() {}

    public Info = ({
        author,
        orgId,
        content,
        title,
    }):
        | false
        | {
              error: boolean;
              msg: string;
          } => {
        if (!author || !orgId) {
            return { error: true, msg: 'authorId and orgId are rquired fields' };
        } else if (typeof author !== 'string' || typeof orgId !== 'string') {
            return { error: true, msg: 'typeof author and orgId should be string' };
        } else if (content) {
            if (typeof content !== 'string') {
                return { error: true, msg: 'typeof content should be string' };
            }
        } else if (title) {
            if (typeof title !== 'string') {
                return { error: true, msg: 'typeof title should be string' };
            }
        } else {
            return false;
        }
    };
}

const validator = new Validator();

export default validator;
