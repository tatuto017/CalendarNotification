export const getProp = (key : string) => {
    return (PropertiesService.getScriptProperties().getProperty(key) || '');
}
  
export const setProp = (key : string, value : string) => {
    PropertiesService.getScriptProperties().setProperty(key, value);
}
