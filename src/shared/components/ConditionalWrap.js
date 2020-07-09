export default ({ condition, wrap, children, elseWrap }) =>
    condition ? wrap(children) : elseWrap ? elseWrap(children) : children;
