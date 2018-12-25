/**
 * A Command Arg.
 * @typedef  {Object}  Arg
 * @property {String}  name         The name of the arg.
 * @property {Boolean} [mand=false] Whether or not this arg is mandatory.
 * @property {String}  [delim=' ']  The delimiting character for this arg.
 */

/**
 * Class representing a command.
 */
class Command {
  /**
   * Create a command.
   * @param {Object}   data                         The command data.
   * @param {String}   data.name                    The command name.
   * @param {String}   data.description             The command description.
   * @param {Function} data.action                  The command action.
   * @param {Object}   [data.options={}]            The command options.
   * @param {Arg[]}    [data.options.arguments=[]]  List of arguments that the command takes.
   * @param {Boolean}  [data.options.hidden=false]  Whether or not this command is private.
   */
  constructor ({ name, description, action, options = {} }) {
    const {
      args = [],
      hidden = false
    } = options

    /**
     * The command name.
     * @type {String}
     */
    this.name = name
    /**
     * The command description.
     * @type {String}
     */
    this.description = description
    /**
     * The command action.
     * @type {Function}
     */
    this.action = action
    /**
     * List of arguments that the command takes.
     * @type {Arg[]}
     */
    this.args = args
    /**
     * Whether or not this command is private.
     * @type {Boolean}
     */
    this.hidden = hidden
  }
}

module.exports = Command
