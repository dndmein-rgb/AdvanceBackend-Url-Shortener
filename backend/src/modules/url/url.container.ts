import { UrlRepository } from "./url.repository";
import { UrlService } from "./url.service";

const urlRepository = new UrlRepository();
const urlService = new UrlService(urlRepository);

export { urlService };
