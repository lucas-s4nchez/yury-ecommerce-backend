import { EntityTarget, ObjectLiteral, QueryRunner, Repository } from "typeorm";
import { BaseEntity } from "./base.entity";
import { ConfigServer } from "./config";
import { AppDataSource } from "./data.source";

export class BaseService<T extends BaseEntity> extends ConfigServer {
  public execRepository: Promise<Repository<T>>;

  constructor(private getEntity: EntityTarget<T>) {
    super();
    this.execRepository = this.initRepository(getEntity);
  }

  async initRepository<T extends ObjectLiteral>(
    entity: EntityTarget<T>
  ): Promise<Repository<T>> {
    const getConnection = await this.initConnect;
    return getConnection.getRepository(entity);
  }

  createQueryRunner(): QueryRunner {
    const queryRunner = AppDataSource.createQueryRunner();
    return queryRunner;
  }
}

// Este código define una clase llamada BaseService que tiene la tarea de proporcionar una funcionalidad básica para interactuar con las entidades de una base de datos utilizando una biblioteca llamada TypeORM.

// Imaginemos que estás construyendo una aplicación que utiliza una base de datos para almacenar información. TypeORM es una biblioteca que facilita la comunicación entre tu aplicación y la base de datos.

// La clase BaseService se encarga de simplificar la creación y el acceso a los repositorios de las entidades. Un repositorio es una especie de almacén de datos para una entidad específica en la base de datos. Permite realizar operaciones como guardar, actualizar, eliminar y buscar registros en esa entidad.

// La clase BaseService recibe el tipo de entidad que deseas trabajar, como por ejemplo "Usuario" o "Producto". Luego, utilizando esa información, se encarga de inicializar y proporcionar acceso a un repositorio relacionado con esa entidad.

// Al utilizar esta clase, no tienes que preocuparte por configurar manualmente la conexión a la base de datos ni por crear los repositorios para cada entidad. BaseService se encarga de eso por ti. Solo necesitas crear una instancia de BaseService para la entidad deseada y luego podrás utilizar el repositorio correspondiente para realizar operaciones en la base de datos de manera más sencilla.

// En resumen, este código facilita la interacción con la base de datos al proporcionar una capa de abstracción y funcionalidad básica para trabajar con las entidades utilizando TypeORM. Simplifica la creación y el acceso a los repositorios de las entidades, lo que te permite realizar operaciones en la base de datos de manera más fácil y organizada en tu aplicación.
