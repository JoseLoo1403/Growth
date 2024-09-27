
export function CleanSqlString(str)
{
    return str.replace(`'`,`''`);
}