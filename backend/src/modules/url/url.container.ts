import { UrlRepository } from "./url.repository";
import { UrlService } from "./url.service";

const urlRespository = new UrlRepository();
const urlService = new UrlService(urlRespository)

export {urlService}