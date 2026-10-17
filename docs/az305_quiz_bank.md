# AZ-305 Question Bank & Study Guide

> Total Master Questions: **27**

### Question 1: Azure SQL Database Retention & Backups
- **Domain:** Design Business Continuity Solutions
- **Type:** Multiple Choice

#### Question:
You manage an Azure SQL Database that hosts transaction data for a financial application. The database must keep point-in-time restore for the last 35 days and must also retain weekly full backups for two years to meet a compliance audit.

You need to recommend a solution that meets the retention requirement while minimizing storage cost.

What should you recommend?

#### Options:
- [x] **Automated backups with a long-term retention policy** *(Correct)*
- [ ] **Daily database exports with Azure Data Factory**
- [ ] **Geo-replication to a secondary region**
- [ ] **Azure Backup for the SQL database**

💡 **Explanation:**
You should recommend automated backups with a long-term retention (LTR) policy. LTR stores weekly, monthly, and yearly full backups in Azure Storage for up to 10 years, satisfying the two-year weekly audit requirement at very low cost (stored in low-cost RA-GRS blob storage). Point-in-time restore (PITR) for the last 35 days is natively supported by extending standard automated short-term backup retention.

❌ **Why Other Options are Wrong:**
- **Geo-replication to a secondary region:** Active geo-replication provides a readable secondary replica for disaster recovery and read scale-out, but it does NOT retain historical backups or satisfy long-term compliance audit retention.
- **Daily database exports with Azure Data Factory:** Exporting the database (.BACPAC) daily with ADF is a custom, complex process that significantly raises storage and operational compute costs, and does not provide point-in-time restore capabilities.
- **Azure Backup for the SQL database:** Azure Backup (Recovery Services Vault) protects SQL Server running on Azure Virtual Machines (IaaS) or on-premises servers; it does NOT apply to the PaaS Azure SQL Database platform service.

📚 **References:**
- *Long-term retention backups - Azure SQL Database and Azure SQL Managed Instance*
- *Automated backups in Azure SQL Database*
- *Active geo-replication*
- *About SQL Server Backup in Azure VMs*

---

### Question 2: Database Backup Retention Periods Comparison
- **Domain:** Design Business Continuity Solutions
- **Type:** Dropdown / Hotspot

#### Question:
Your company moved several databases from on-premises to Azure. You are currently using default automated database backups. Your current Azure database resources are:
- SqlDB01: Azure SQL Database (Basic)
- SqlDB02: Azure SQL Managed Instance (Standard)
- SqlDB03: Azure SQL Managed Instance (Premium)
- SqlDW01: Azure Synapse SQL pool (Premium)

Your company is reviewing its internal guidelines for data backup and recovery. You need to identify the retention periods supported for each of the databases.

For each retention period, select the databases that support that retention period.

#### Dropdown Sentence Formats & Options:
1. **You should use [ -Select- ] .**
   - *Options:* `zone-redundant storage (ZRS)` | `locally redundant storage (LRS)` | `geo-redundant storage (GRS)` | `geo-zone-redundant storage (GZRS)`
   - **Correct Answer:** `zone-redundant storage (ZRS)`
   - *Explanation:* ZRS synchronously replicates data across three availability zones in the same region, protecting against the loss of a single datacenter/zone while avoiding expensive cross-region replication costs.

2. **You [ -Select- ] include Azure Site Recovery.**
   - *Options:* `should not` | `should`
   - **Correct Answer:** `should not`
   - *Explanation:* With an RTO of 96 hours (4 full days), paying ongoing replication and storage licensing fees for Azure Site Recovery (ASR) is unnecessary and violates the requirement to minimize cost.

3. **If an outage occurs, you should [ -Select- ] .**
   - *Options:* `use the ARM template to deploy the VMs to an available zone` | `perform an Azure Site Recovery failover` | `restore the virtual machines from Azure Backup` | `fail over the storage account manually`
   - **Correct Answer:** `use the ARM template to deploy the VMs to an available zone`
   - *Explanation:* Because storage is zone-redundant (data remains available in the healthy zones) and the RTO is 96 hours, redeploying the VMs from the existing ARM template into an operational zone meets the objective with zero idle compute costs.

📚 **References:**
- *Backup and restore dedicated SQL pools in Azure Synapse Analytics*
- *Automated backups in Azure SQL Database*
- *Long-term retention backups - Azure SQL Database and Azure SQL Managed Instance*
- *DTU-based purchasing model overview*

---

### Question 3: Azure SQL Database Zone Redundancy
- **Domain:** Design Business Continuity Solutions
- **Type:** Multiple Choice

#### Question:
You run a business-critical application on Azure SQL Database in the General Purpose tier in the East US region. The database must stay available if a single datacenter within the region fails, without depending on another region.

You need to recommend a high availability configuration.

What should you recommend?

#### Options:
- [ ] **Geo-redundant backup storage for the database**
- [ ] **Active geo-replication to a secondary region**
- [x] **A zone-redundant configuration for the database** *(Correct)*
- [ ] **A failover group in a second region**

💡 **Explanation:**
You should recommend a zone-redundant configuration for the database. A zone-redundant database places compute gateways and storage across three distinct Availability Zones within the same region, ensuring high availability if one datacenter in the region fails, with zero dependency on another region.

❌ **Why Other Options are Wrong:**
- **Active geo-replication to a secondary region:** Active geo-replication is a cross-region disaster recovery mechanism that replicates to a secondary region. It introduces cross-region dependency rather than in-region datacenter isolation.
- **A failover group in a second region:** A failover group provides automated cross-region disaster recovery, violating the requirement to operate without depending on another region.
- **Geo-redundant backup storage for the database:** Geo-redundant backup storage copies backups to a paired secondary region for disaster recovery, but it does NOT provide live high-availability for active queries during a local datacenter failure.

📚 **References:**
- *Availability through redundancy - Azure SQL Database*
- *Active geo-replication*
- *Failover groups overview & best practices (Azure SQL Database)*
- *Automated backups in Azure SQL Database*

---

### Question 4: Multi-Region AKS, Container Registry Geo-Replication & Traffic Routing
- **Domain:** Design Business Continuity Solutions
- **Type:** Dropdown / Hotspot

#### Question:
You are designing a solution to host microservices in Azure Kubernetes Service (AKS) for a video streaming application.

You need to recommend a solution that meets the following requirements:
- The application should be highly available and should not be impacted by AKS platform updates.
- The cost of pulling images from the Azure Container Registry must be minimized.
- User requests must go to the nearest application deployment.

To answer, select the appropriate options from the drop-down menus.

#### Dropdown Options Available for Selection:
- **Target Deployment:** `Deploy the AKS clusters to a region pair` | `Deploy the AKS clusters across availability zones in Central US only` | `Deploy a single AKS cluster with multiple node pools in East US 2 only`
- **ACR Image Pulls:** `Enable geo-replication on a Premium Azure Container Registry` | `Create an independent Basic Azure Container Registry in each region` | `Export container images to an Azure Storage Blob account with GRS`
- **Traffic Routing:** `Azure Traffic Manager` | `Azure Application Gateway` | `Azure Standard Load Balancer`

#### Selections & Answers:
- **Ensure that the application is highly available and that it is not impacted by AKS platform updates.:** `Deploy multiple Azure Kubernetes Service (AKS) clusters in paired regions.`
  - *Explanation:* Azure guarantees that planned platform updates and maintenance are sequentially staggered across paired regions. Deploying AKS in paired regions ensures that if an update rolls out in the primary region, the paired region remains unaffected and online.
- **Minimize the cost of pulling images from the Azure Container Registry.:** `Enable geo-replication for container images in Azure container registries.`
  - *Explanation:* Enabling geo-replication on a Premium Azure Container Registry (ACR) allows AKS nodes in each region to pull container images locally from their own region, completely eliminating cross-region network egress data transfer fees and reducing image pull latency.
- **Ensure that user requests go to the nearest application deployment.:** `Use Traffic Manager to send the request based on the request region of the user.`
  - *Explanation:* Azure Traffic Manager uses DNS-based routing (Geographic or Performance routing methods) to route client requests to the closest regional endpoint with lowest latency, optimizing user experience for global video streaming.

📚 **References:**
- *Multi-region deployment models for Azure Kubernetes Service (AKS)*
- *Azure region pairs and nonpaired regions*
- *What is Azure Traffic Manager?*
- *Geo-replication in Azure Container Registry*
- *Azure Load Balancer algorithm*

---

### Question 5: Multi-Tier Disaster Recovery Replication Strategies
- **Domain:** Design Business Continuity Solutions
- **Type:** Drag and Drop / Matching

#### Question:
You are designing a recovery solution for your company's primary IT systems, which reside in the Azure Central US region. The East US 2 region, the paired region for Central US, has been identified as the target region to be used for disaster recovery.

You need to determine which data replication strategy you should use to ensure that the core systems have the minimum Recovery Point Objective (RPO) without having to use additional services unnecessarily, while being able to failback to the primary site with the least amount of effort.

Which data replication technology or configuration should you use for each system?

#### Selections & Answers:
- **Archive blob storage account:** `Geo-redundant storage (GRS)`
  - *Explanation:* GRS is the native built-in storage replication feature for Blob storage to the paired region. It does not require any additional services (like Site Recovery) and automatically replicates blobs to East US 2.
- **SQL Server on Azure Virtual Machine:** `Availability groups`
  - *Explanation:* SQL Server Always On Availability Groups provides the minimum RPO (near-zero transaction loss), is a native feature inside SQL Server (no additional Azure service purchase required), and provides effortless failback because reverse replication resumes automatically when the primary region recovers.
- **Managed Disks for web-facing servers:** `Azure Site Recovery`
  - *Explanation:* Web-facing servers use managed disks and do not have native database replication engines. Azure Site Recovery (ASR) continuously replicates their OS and application managed disks to the secondary paired region for automated failover.

📚 **References:**
- *Azure region pairs and nonpaired regions*
- *Azure Storage redundancy*
- *Fail Over to a Log Shipping Secondary (SQL Server)*
- *Redundancy options for managed disks*
- *About Site Recovery*

---

### Question 6: Azure Backup for SQL Server on Virtual Machines
- **Domain:** Design Business Continuity Solutions
- **Type:** Multiple Choice

#### Question:
Your company runs multiple Azure virtual machines that host SQL Server databases for production workloads. The recovery point objective is four hours. Backups must be transactionally consistent, and individual databases must be restorable without restoring the entire virtual machine.

You need to recommend a backup solution that meets these requirements.

Which solution should you recommend?

#### Options:
- [ ] **Managed disk snapshots of the virtual machine disks**
- [ ] **Azure Backup with file-level backup of the SQL Server data files**
- [x] **Azure Backup with the SQL Server workload backup extension** *(Correct)*
- [ ] **Azure Backup with an enhanced virtual machine backup policy**

💡 **Explanation:**
You should recommend Azure Backup with the SQL Server workload backup extension. Azure Backup installs the AzureBackupWindowsWorkload extension on the VM and streams backups through the native SQL Virtual Device Interface (VDI), ensuring every backup is transactionally consistent. It natively supports Full, Differential, and 15-minute log backups, and allows restoring individual databases to any point in time without having to restore the entire VM.

❌ **Why Other Options are Wrong:**
- **Managed disk snapshots of the virtual machine disks:** Disk snapshots capture raw disk blocks without coordinating with the SQL engine (crash-consistent only). If data is sitting in memory, it will not be captured, leading to dirty/inconsistent database state. Snapshots cannot restore a single individual database.
- **Azure Backup with an enhanced virtual machine backup policy:** Standard or enhanced VM backup policies capture the entire virtual machine image. They cannot restore a single SQL database individually without restoring the whole VM.
- **Azure Backup with file-level backup of the SQL Server data files:** Copying raw .mdf/.ldf files while SQL Server is active can corrupt files because it does not quiesce active memory transactions via VSS/VDI.

📚 **References:**
- *Back up multiple SQL Server VMs from the Recovery Services vault*
- *An overview of Azure VM backup*
- *Azure Backup architecture and components*
- *Create a snapshot of a virtual hard disk*

---

### Question 7: Azure Site Recovery Cache Storage Account Placement
- **Domain:** Design Business Continuity Solutions
- **Type:** Multiple Choice (Select Two)

#### Question:
You deploy a VM named vm-east to the East US region, and another VM named vm-west to the West US region.

You need to use Azure Site Recovery to replicate the VMs from East US and West US to Central US and South Central US.

In which two regions do cache storage accounts get created? Each correct answer presents part of the solution.

#### Options:
- [x] **East US** *(Correct)*
- [x] **West US** *(Correct)*
- [ ] **South Central US**
- [ ] **Central US**

💡 **Explanation:**
The cache storage accounts get created in the SOURCE regions (East US and West US). In Azure Site Recovery (Azure-to-Azure replication), VM disk writes are captured in real time by the Site Recovery Mobility service extension and written locally to a standard cache storage account in the source region before being encrypted and replicated over the network to the target region. The cache storage accounts are never created in the destination/target regions.

❌ **Why Other Options are Wrong:**
- **Central US:** Central US is a target/destination region. Cache storage accounts are always located in the source region to buffer local VM writes before sending them across regions.
- **South Central US:** South Central US is a target/destination region, not a source region.

📚 **References:**
- *Tutorial: Set up disaster recovery for Azure VMs*
- *Recovery Services vaults overview*
- *Back up Azure VMs in a Recovery Services vault*
- *About Site Recovery*

---

### Question 8: Azure SQL Auto-Failover Groups vs Active Geo-Replication
- **Domain:** Design Business Continuity Solutions
- **Type:** Multiple Choice (Select Two)

#### Question:
Your company runs several Azure SQL databases on a single logical server for an order-processing application. If the primary region fails, all of the databases must failover together, and the application connection strings must not change.

You need to recommend a solution. What should you recommend?

Each correct answer presents part of the solution.

#### Options:
- [ ] **Manual failover scripts for each database**
- [ ] **Active geo-replication for each database**
- [x] **An auto-failover group for the logical server** *(Correct)*
- [ ] **A zone-redundant configuration for each database**
- [x] **The read-write and read-only listener endpoints** *(Correct)*

💡 **Explanation:**
You should recommend an auto-failover group for the logical server combined with its read-write and read-only listener endpoints. An auto-failover group automatically fails over all databases under the logical server as a single synchronized unit to the paired secondary region. The read-write listener provides a static DNS endpoint (<fog-name>.database.windows.net) so application connection strings never need to change during or after a failover.

❌ **Why Other Options are Wrong:**
- **Active geo-replication for each database:** Active geo-replication replicates databases individually rather than as a group, requires manual failover for each database, and does not provide a single static listener endpoint (connection strings would have to be manually changed to point to the secondary server name).
- **A zone-redundant configuration for each database:** Zone redundancy protects against in-region datacenter/zone failures, not complete regional outages.
- **Manual failover scripts for each database:** Manual failover scripts are error-prone, introduce downtime, and do not keep connection strings unchanged.

📚 **References:**
- *Failover groups overview & best practices (Azure SQL Database)*
- *Configure a failover group for Azure SQL Database*
- *Active geo-replication*
- *Availability through redundancy - Azure SQL Database*

---

### Question 9: Recovery Services Vault GRS & Cross-Region Restore (CRR)
- **Domain:** Design Business Continuity Solutions
- **Type:** Multiple Choice

#### Question:
Your company backs up Azure virtual machines to a Recovery Services vault in the East US region. The business continuity plan requires that, if the East US region becomes unavailable, the virtual machines can be restored on demand into the paired West US region from the existing backups.

You need to recommend how to configure the vault.

What should you recommend?

#### Options:
- [ ] **Continuous replication with Azure Site Recovery**
- [x] **Geo-redundant storage with cross-region restore enabled** *(Correct)*
- [ ] **Locally redundant storage on the vault**
- [ ] **Zone-redundant storage on the vault**

💡 **Explanation:**
You should recommend Geo-redundant storage (GRS) with cross-region restore (CRR) enabled on the Recovery Services vault. GRS replicates backup data from East US to the paired secondary region (West US). Enabling Cross-Region Restore (CRR) allows administrators to restore virtual machines on demand in the paired region at any time (even for drill/testing or regional degradation) directly from the secondary backup storage, without waiting for Microsoft to declare an official regional disaster.

❌ **Why Other Options are Wrong:**
- **Continuous replication with Azure Site Recovery:** Azure Site Recovery (ASR) is a continuous replication and disaster recovery failover tool, not a vault storage configuration. Furthermore, ASR does not restore VMs on demand from existing backup snapshots.
- **Locally redundant storage on the vault:** Locally redundant storage (LRS) keeps backup copies only within a single datacenter in the East US region. If East US fails, backups are completely inaccessible.
- **Zone-redundant storage on the vault:** Zone-redundant storage (ZRS) replicates backups across availability zones within the primary East US region, but does not provide cross-region recovery if the entire East US region goes down.

📚 **References:**
- *Create and configure Recovery Services vaults*
- *Azure Storage redundancy*
- *About Site Recovery*
- *Recovery Services vaults overview*

---

### Question 10: Azure SQL Auto-Failover Groups for Low RTO/RPO Disaster Recovery
- **Domain:** Design Business Continuity Solutions
- **Type:** Multiple Choice

#### Question:
Your company runs a mission-critical application backed by multiple Azure SQL databases. The business continuity requirements specify that in the event of a primary regional outage:
- The Recovery Time Objective (RTO) must not exceed 5 minutes.
- The Recovery Point Objective (RPO) must be limited to only a few seconds of data loss.
- Application connection strings must remain unchanged without manual reconfiguration.

You need to recommend a disaster recovery solution that meets these requirements.

What should you recommend?

#### Options:
- [ ] **Manual database failover**
- [ ] **Point-in-time database restoration**
- [x] **Auto-failover groups** *(Correct)*
- [ ] **Geo-restore from geo-replicated backups**

💡 **Explanation:**
You should recommend Auto-failover groups. Auto-failover groups continuously synchronize data between the primary and geo-secondary server (achieving an RPO of a few seconds of uncommitted/in-flight transactions). They provide static read-write and read-only listener DNS endpoints so application connection strings do not change during failover. With a customer-managed failover policy, administrators can initiate immediate failover upon detecting an outage, meeting the aggressive 5-minute RTO requirement without waiting on slow backup restores.

❌ **Why Other Options are Wrong:**
- **Geo-restore from geo-replicated backups:** Geo-restore restores a database from geo-redundant backup blobs. Because it is a size-of-data restore operation, it takes hours (violating the 5-minute RTO) and backup replication lag is up to 1 hour (violating the few-seconds RPO).
- **Manual database failover:** Manual failover of individual databases using Active Geo-Replication must be initiated one database at a time and changes the server name, requiring manual updates to application connection strings that will exceed the 5-minute RTO budget.
- **Point-in-time database restoration:** Point-in-time restore (PITR) is designed for accidental data deletion or corruption recovery within the same server/region. It does not provide cross-region disaster recovery during a regional datacenter outage.

📚 **References:**
- *Business continuity in Azure SQL Database*
- *Restore a database from a backup in Azure SQL Database*
- *Designing globally available services using Azure SQL Database*
- *Active geo-replication*

---

### Question 11: PostgreSQL Flexible Server LTR & Cosmos DB Continuous Backup Mode
- **Domain:** Design Business Continuity Solutions
- **Type:** Multiple Choice (Select Two)

#### Question:
Your company runs an Azure Database for PostgreSQL flexible server and an Azure Cosmos DB account for a financial application. Compliance requires monthly backups of the PostgreSQL server retained for five years. The team must also be able to restore the Cosmos DB account to any point in the last 30 days without opening a support request.

You need to recommend how to protect the two data services.

What should you recommend? Each correct answer presents part of the solution.

#### Options:
- [ ] **A Recovery Services vault with geo-redundant storage**
- [x] **A Backup vault with long-term retention for the PostgreSQL flexible server** *(Correct)*
- [x] **Continuous backup mode for the Azure Cosmos DB account** *(Correct)*
- [ ] **Periodic backup mode for the Azure Cosmos DB account**
- [ ] **Active geo-replication for the Azure Cosmos DB account**

💡 **Explanation:**
You should recommend a Backup vault with long-term retention for PostgreSQL flexible server and continuous backup mode for Cosmos DB.
1. Backup Vault for PostgreSQL: Azure Backup uses a Backup vault (not Recovery Services vault) to manage long-term retention (LTR) backups for Azure Database for PostgreSQL Flexible Server for up to 10 years, satisfying the 5-year requirement.
2. Continuous Backup for Cosmos DB: Continuous backup mode enables self-service point-in-time restore (PITR) up to 30 days directly via Azure Portal, CLI, or PowerShell without needing to open a support ticket.

❌ **Why Other Options are Wrong:**
- **Periodic backup mode for the Azure Cosmos DB account:** Periodic backup mode requires contacting Microsoft Support to initiate a restore; it does not provide self-service point-in-time restore.
- **A Recovery Services vault with geo-redundant storage:** Recovery Services vaults are used for Azure VMs, Azure Files, and SQL in VMs, but do not support long-term retention for PostgreSQL Flexible Server, which requires a Backup vault.
- **Active geo-replication for the Azure Cosmos DB account:** Multi-region geo-replication replicates live data for low latency and high availability, but does not provide historical backup retention or point-in-time recovery for accidental deletes/corruptions.

📚 **References:**
- *About Azure Database for PostgreSQL - Flexible server backup*
- *Continuous backup with point-in-time restore in Azure Cosmos DB*
- *Periodic backup and restore in Azure Cosmos DB*
- *Create and configure a Recovery Services vault*
- *Distribute your data globally with Azure Cosmos DB*

---

### Question 12: Storage Redundancy & Disaster Recovery with Long RTO (Cost Optimization)
- **Domain:** Design Business Continuity Solutions
- **Type:** Dropdown / Hotspot

#### Question:
Your company builds a demo environment in Azure by using an Azure Resource Manager (ARM) template. The demo environment includes three VMs that use general-purpose v2 storage accounts.

You plan to implement a disaster recovery solution for the demo environment.

The disaster recovery solution must:
- Be able to recover from the failure of a single Azure datacenter (that is, the loss of one availability zone)
- Meet a recovery time objective (RTO) of 96 hours.
- Minimize cost.

You need to recommend a storage replication type, determine whether the Azure Site Recovery service should be included, and decide what should be done if an outage occurs.

What should you recommend? To answer, select the appropriate options from the drop-down menus.

#### Selections & Answers:
- **Storage replication type::** `zone-redundant storage (ZRS)`
  - *Explanation:* ZRS replicates data across three availability zones in the same region, protecting against the loss of a single datacenter/zone while costing significantly less than cross-region replication (GRS).
- **Azure Site Recovery inclusion::** `should not`
  - *Explanation:* With an RTO of 96 hours (4 full days), paying ongoing replication and storage licensing fees for Azure Site Recovery (ASR) is unnecessary and violates the requirement to minimize cost.
- **Action if an outage occurs::** `use ARM templates to re-create VMs`
  - *Explanation:* Because storage is zone-redundant (data is safe in healthy zones) and the RTO is 96 hours, redeploying the VMs from existing ARM templates into an operational zone minimizes idle standby costs.

📚 **References:**
- *Azure Storage redundancy*
- *General questions about Azure Site Recovery*
- *Create a Windows virtual machine from a Resource Manager template*

---

### Question 13: Solution Evaluation - Retail Web Architecture
- **Domain:** Design Business Continuity Solutions
- **Type:** Case Study / Solution Evaluation Series

#### 📋 Scenario:
CompanyA is a large online clothing retail store that operates from various datacenters in multiple cities in the US. The IT operations team faces many challenges to meet the high demand whenever a sale is planned for the products. You need to recommend a highly available and fault-tolerant application design that meets the following requirements:
- The application must scale based on traffic and demand.
- The application must be able to self-diagnose and self-heal in the case of a failure.
- The database must be available in case of Azure outages.
- The application must be optimized for static content like photos and videos.
- SSL offloading and certificate management must minimize complexity.

> *This case study contains a series of questions that present the same scenario. Each question in the series contains a unique solution that might meet the stated goals. Note: You cannot go back or review questions of this type on the actual certification exam.*

##### Part 1:
**Proposed Solution:** Deploy the application on Azure VMs with an availability set within two regions in active/passive mode. Use Azure SQL Database with Geo-replication enabled. Use Azure Application Gateway for SSL offloading and route traffic using Azure Traffic Manager with performance routing between the two regions.

**Question:** Does this solution meet the goal?

**Options:**
- [ ] **Yes**
- [x] **No** *(Correct)*

💡 **Explanation:**
This solution does NOT meet the goal for several reasons:
1. No Autoscale: Azure VMs in Availability Sets cannot autoscale dynamically based on demand; they require manual VM provisioning.
2. No Self-Healing: Availability Sets distribute VMs across fault/update domains, but do NOT provide automated instance health monitoring and automatic repair/replacement (which requires VMSS Automatic Instance Repair).
3. No Static Content Optimization: The solution lacks Azure CDN or caching for high-res images and videos.
4. Incorrect Routing: The architecture is Active/Passive, but Traffic Manager is configured with Performance routing (which routes to closest region) instead of Priority routing (which routes all active traffic to primary and fails over only during outages).

##### Part 2:
**Proposed Solution:** Deploy the application on Azure VM scale sets in multiple availability zones in two regions in active/passive mode. Enable scheduled VMSS autoscaling for the holiday sale dates throughout the year. Use Azure SQL Database with Geo-replication enabled. Use Azure Application Gateway for SSL offloading and route traffic using Azure Traffic Manager using priority routing between the two regions. Use Azure Content Delivery Network (CDN) to cache the static content and optimize the application's performance.

**Question:** Does this solution meet the goal?

**Options:**
- [x] **Yes** *(Correct)*
- [ ] **No**

💡 **Explanation:**
This solution MEETS all the stated requirements:
1. Scalability: VM Scale Sets (VMSS) with scheduled autoscaling scale instances up before and during high-traffic holiday sales events.
2. Self-Healing: Multi-AZ VMSS with automatic instance repair monitors VM health and replaces failed instances automatically.
3. High Availability Database: Azure SQL Database with Active Geo-replication provides cross-region database resilience.
4. Static Content Optimization: Azure CDN caches images and videos at edge PoP locations near users.
5. SSL Offloading & Routing: Application Gateway manages SSL termination and certificates, while Traffic Manager Priority routing routes all traffic to the active region and automatically fails over to the passive region if the active region becomes unhealthy.

##### Part 3:
**Proposed Solution:** Deploy the application on Azure VM scale sets in multiple availability zones in two regions in active/passive mode. The VM scale sets have an autoscaling rule based on CPU utilization. Use Azure SQL Database with Geo-replication enabled. Use Azure Front Door to perform the SSL offloading and route traffic using the priority routing method. Use the caching feature of Azure Front Door to optimize the application's performance for static content.

**Question:** Does this solution meet the goal?

**Options:**
- [x] **Yes** *(Correct)*
- [ ] **No**

💡 **Explanation:**
This solution MEETS all the stated requirements in an elegant, unified architecture:
1. Scalability: VMSS metric-based autoscaling (CPU utilization) dynamically adjusts VM count in response to real-time traffic demand.
2. Self-Healing: Multi-AZ VMSS with automatic instance repair replaces unhealthy instances automatically.
3. High Availability Database: Azure SQL Database with Active Geo-replication provides regional database failover.
4. Static Content & SSL Offload: Azure Front Door combines global Layer 7 load balancing, SSL termination/certificate management, priority active/passive health probe routing, and integrated edge caching for static assets into a single managed service.

📚 **References:**
- *Traffic Manager routing methods*
- *Overview of TLS termination and end to end TLS with Application Gateway*
- *Active geo-replication*
- *Availability sets overview*

---

### Question 14: Azure Blob Vaulted Backup vs Operational Backup (Ransomware & Account Deletion Protection)
- **Domain:** Design Business Continuity Solutions
- **Type:** Multiple Choice

#### Question:
You have an Azure storage account that contains critical blob data for a financial application. You need to recommend a backup solution that meets the following requirements:
- The backup data must survive if the source storage account is compromised or deleted.
- Backups must be stored in an isolated management domain.
- Backups must be retained for up to 10 years.

What should you recommend?

#### Options:
- [ ] **Blob versioning with soft delete enabled**
- [ ] **Read-access geo-redundant storage on the account**
- [ ] **Operational backup for the storage account**
- [x] **Vaulted backup for the storage account** *(Correct)*

💡 **Explanation:**
You should recommend vaulted backup for the storage account. Vaulted backup copies blob data offsite into a dedicated Backup vault located in a Microsoft-managed tenant/subscription. Because the backup data is logically and physically isolated outside the customer storage account boundary, it survives ransomware attacks, malicious actor tampering, or total deletion of the source storage account. Vaulted backups support long-term retention policies for up to 10 years.

❌ **Why Other Options are Wrong:**
- **Operational backup for the storage account:** Operational backup uses local blob capabilities (versioning, change feed, soft delete, and point-in-time restore) entirely within the source storage account. If the storage account is deleted or compromised, the operational backup data is destroyed.
- **Blob versioning with soft delete enabled:** Versioning and soft delete protect against accidental overwrites within the same container, but all data resides inside the source account. If an attacker deletes the account or clears container policies, the data is lost.
- **Read-access geo-redundant storage on the account:** RA-GRS replicates all data operations (including malicious delete and overwrite commands) asynchronously to the paired secondary region. It provides regional hardware durability, not protection against malicious deletion.

📚 **References:**
- *Overview of Azure Blob backup*
- *Point-in-time restore for block blobs*
- *Soft delete for blobs*
- *Azure Storage redundancy*

---

### Question 15: High Scale Compute Limits: App Service vs VMSS vs Availability Sets
- **Domain:** Design Infrastructure Solutions
- **Type:** Yes/No Statements

#### Question:
You have a website implementation with the following requirements:
- Support up to 1,000 identical scale-out servers.
- Support multiple datacenters (availability zones within a region) for high availability.
- Enable the servers to automatically scale out and in based on CPU utilization.

You need to design a high-availability solution that meets the requirements.

For each of the following statements, select Yes if the statement is true. Otherwise, select No.

#### Statements & Answers:
- **Azure App Service web apps can meet the scale-out requirement.:** `No`
  - *Explanation:* App Service plans scale out to a maximum of 30 instances on Premium v2/v3/v4 tiers, 100 instances on Isolated v2, and up to 200 instances total across an App Service Environment v3 (ASEv3) — far below the 1,000 scale-out instances required.
- **Virtual machine scale sets can meet the requirement to support multiple datacenters.:** `Yes`
  - *Explanation:* Virtual Machine Scale Sets (VMSS) natively support up to 1,000 VM instances (when deployed from Marketplace or Azure Compute Gallery images) and can automatically distribute these instances across Availability Zones (multiple datacenters) within an Azure region, complete with metric-based CPU autoscaling.
- **Deploying the solution into availability sets would meet the high-availability requirement.:** `No`
  - *Explanation:* Availability Sets only protect against hardware/rack failures within a single datacenter (fault/update domains) and cannot span Availability Zones (multiple datacenters). Additionally, Availability Sets are capped at 200 VMs max and do not support metric-based CPU autoscaling.

📚 **References:**
- *What are Virtual Machine Scale Sets?*
- *Orchestration modes for Virtual Machine Scale Sets in Azure*
- *Availability sets overview*
- *Baseline highly available zone-redundant web application*

---

### Question 16: Storage Redundancy: RA-GZRS for Zone + Region Failure & Secondary Read Access
- **Domain:** Design Relational and Non-Relational Data Storage Solutions
- **Type:** Multiple Choice

#### Question:
Your company has developed an Azure web app that provides automated customer and technical support for many of its products. The web app uses Azure Blob storage to provide users with documentation and large file downloads. Many of the files are updated periodically to add vulnerability protections and bug fixes, and products are identified in the company's consumer software products.

The majority of your company's customers are located in central United States (US). You deploy multiple instances of the web app in the North Central US and South Central US Azure regions. The storage account for the primary data store is in the North Central US region and is configured for locally redundant storage (LRS). There are performance concerns when users from the South Central US region download large files.

You need to modify your storage solution configuration to:
- Ensure that file updates can be applied only once.
- Enable users to download files from the same region as the web app instance they are accessing.
- Protect your data in case of a single-datacenter (availability zone) or region-wide failure.
- Minimize costs and administrative overhead to implement and maintain the solution.

What should you do?

#### Options:
- [ ] **Configure your storage account for geo-redundant storage (GRS).**
- [ ] **Deploy and configure Azure File Sync.**
- [x] **Configure your storage account for read-access geo-zone-redundant storage (RA-GZRS).** *(Correct)*
- [ ] **Implement Azure Content Delivery Network (CDN).**

💡 **Explanation:**
You should configure the storage account for Read-Access Geo-Zone-Redundant Storage (RA-GZRS):
1. Zone + Regional Resiliency: GZRS copies data across 3 Availability Zones in the primary region (North Central US) to protect against datacenter failures, and replicates asynchronously to the paired secondary region (South Central US) to protect against whole-region outages.
2. Local Regional Read Access: The 'Read-Access' (RA) capability exposes a read-only secondary endpoint (<accountname>-secondary.blob.core.windows.net) in South Central US, allowing South Central web app users to download files locally with low latency.
3. Single Update: Administrators only upload/update files once in the primary region; Azure automatically handles background synchronization to the secondary region.

❌ **Why Other Options are Wrong:**
- **Configure your storage account for geo-redundant storage (GRS).:** GRS only uses LRS in the primary region (cannot survive a zone/datacenter loss) and does NOT provide read access to the secondary region unless an official failover is initiated.
- **Implement Azure Content Delivery Network (CDN).:** Azure CDN caches static web assets at edge PoPs, but does not provide storage redundancy across zones/regions for raw blob storage.
- **Deploy and configure Azure File Sync.:** Azure File Sync synchronizes on-premises Windows file servers with Azure Files; it does not apply to Blob storage multi-region read distribution.

📚 **References:**
- *Azure Storage redundancy*
- *Storage account overview*
- *Planning for an Azure File Sync deployment*
- *What is a content delivery network on Azure?*
- *Cross-region replication in Azure: Business continuity and disaster recovery*

---

### Question 17: Azure Files Vaulted Backup in Recovery Services Vault (Offsite & Multi-Year Retention)
- **Domain:** Design Business Continuity Solutions
- **Type:** Multiple Choice

#### Question:
Your company stores documents in an Azure file share. The business continuity plan requires an offsite backup that survives the loss of the storage account and can be restored in another region, with retention for several years.

You need to recommend a backup solution for the file share.

What should you recommend?

#### Options:
- [ ] **Azure File Sync with cloud tiering**
- [ ] **Scheduled share snapshots in the storage account**
- [x] **Vaulted backup in a Recovery Services vault** *(Correct)*
- [ ] **Locally redundant storage for the storage account**

💡 **Explanation:**
You should recommend vaulted backup in a Recovery Services vault. Azure Backup for Azure Files provides a vaulted tier (in addition to standard in-storage snapshots) that transfers and isolates backup copies into a Recovery Services vault. This guarantees that backup data survives total storage account deletion, supports multi-year retention (up to 10 years), and can be restored to a secondary paired region.

❌ **Why Other Options are Wrong:**
- **Scheduled share snapshots in the storage account:** Share snapshots reside inside the same storage account. If the storage account is deleted, compromised, or corrupted, all snapshots are immediately lost.
- **Azure File Sync with cloud tiering:** Cloud tiering is a caching optimization feature that keeps frequently accessed files on-premises and tiers cold files to Azure; it is not a backup or point-in-time recovery solution.
- **Locally redundant storage for the storage account:** LRS keeps 3 copies in a single datacenter within the primary region; it does not provide offsite backup or cross-region recovery.

📚 **References:**
- *About Azure Files backup*
- *Back up Azure Files*
- *Azure File Sync cloud tiering overview*
- *Azure Storage redundancy*

---

### Question 18: Mission-Critical High Availability: Multi-Region, Geo-Replication & Availability Set Mechanics
- **Domain:** Design Infrastructure Solutions
- **Type:** Yes/No Statements

#### Question:
A company is building a mission-critical application for which downtime could lead to substantial business loss.

The company developers are seeking ways to build redundancy into the application to meet high availability goals. The company can devote considerable resources toward this objective.

You need to recommend a solution that meets the goals.

For each of the following statements, select Yes if the statement is true. Otherwise, select No.

#### Statements & Answers:
- **You should deploy the application across two or more regions.:** `Yes`
  - *Explanation:* For mission-critical enterprise workloads with high resource budgets, multi-region active/passive or active/active deployments provide maximum resiliency against complete regional Azure outages.
- **You should configure database replicas in one or more secondary regions (geo-replication).:** `Yes`
  - *Explanation:* Geo-replication (supported by Azure SQL Database, Cosmos DB, etc.) ensures data redundancy across secondary regions, enabling read scale-out and fast regional failover.
- **You should place VMs in more than one availability set.:** `No`
  - *Explanation:* To achieve redundancy, redundant VMs belonging to the same tier must be placed inside the SAME Availability Set so Azure guarantees they are separated across distinct fault domains (hardware/power/network) and update domains. Placing VMs in separate availability sets means Azure cannot coordinate rack placement, risking both VMs ending up on the same physical host or rack.

📚 **References:**
- *Highly available multi-region web application*
- *What are Azure regions and availability zones?*
- *Make all things redundant*

---

### Question 19: Ransomware Defense: Locked Vault Immutability & Multi-User Authorization (Resource Guard)
- **Domain:** Design Business Continuity Solutions
- **Type:** Multiple Choice (Select Two)

#### Question:
Your company protects business-critical Azure virtual machines in a Recovery Services vault. Security requires the vault to reach the Excellent security level against ransomware, so that a single compromised administrator cannot delete recovery points or turn off the safeguards.

You need to recommend how to configure the vault.

What should you recommend? Each correct answer presents part of the solution.

#### Options:
- [ ] **A daily backup schedule for the virtual machines**
- [x] **A locked immutability setting on the vault** *(Correct)*
- [ ] **The Backup Contributor role for the vault operators**
- [ ] **Geo-redundant storage on the vault**
- [x] **Multi-user authorization with a Resource Guard** *(Correct)*

💡 **Explanation:**
To protect backups against ransomware and rogue/compromised administrators and achieve the 'Excellent' security level:
1. Locked Vault Immutability: Makes all backup recovery points write-once-read-many (WORM) and prevents deletion before retention expiry. Locking immutability ensures the protection is irreversible and cannot be turned off by any administrator.
2. Multi-User Authorization (MUA) with Resource Guard: Places destructive operations (disabling protection, stopping backups, deleting data) behind a Resource Guard located in a separate subscription/tenant, requiring approval from an independent secondary administrator.

❌ **Why Other Options are Wrong:**
- **Geo-redundant storage on the vault:** GRS provides cross-region disaster recovery hardware durability, but does not prevent a malicious administrator from executing delete/stop-backup commands.
- **The Backup Contributor role for the vault operators:** Backup Contributor grants operational permissions to perform backups and restores, but does not enforce multi-party approval or prevent deletion of recovery points.
- **A daily backup schedule for the virtual machines:** Backup schedule determines RPO, but offers no protection against malicious deletion of existing recovery points.

📚 **References:**
- *Overview of security features in Azure Backup*
- *Multiuser authorization using Resource Guard*
- *Design a ransomware-resilient backup architecture by using Azure Backup*
- *Azure Backup security best practices to safeguard backup data*

---

### Question 20: Hybrid BCDR: Azure Backup (File/Folder) & Azure Site Recovery (Site Disaster Failover)
- **Domain:** Design Business Continuity Solutions
- **Type:** Multiple Choice (Select Two)

#### Question:
You are administering an on-premises environment with a Hyper-V host server for hosting virtual machines. You are requested to recommend a solution to meet the following requirements:
- Back up and restore individual files and folders on your Windows machines.
- Keep entire workloads running even if the whole on-premises site stops functioning.
- Minimize maintenance efforts, downtime, and restore time.

Which two technologies should you recommend? Each correct answer presents part of the solution.

#### Options:
- [ ] **Storage Replica**
- [ ] **High Availability (HA) clustering**
- [x] **Azure Backup** *(Correct)*
- [x] **Azure Site Recovery** *(Correct)*
- [ ] **Volume Shadow Copy Service (VSS)**

💡 **Explanation:**
You should recommend Azure Backup and Azure Site Recovery:
1. Azure Backup: Provides cloud-based automated file and folder level backup and granular recovery for on-premises Windows machines using the Microsoft Azure Recovery Services (MARS) agent without requiring on-premises secondary backup infrastructure.
2. Azure Site Recovery (ASR): Continuously replicates Hyper-V virtual machines to Azure and orchestrates automated failover of entire workloads to Azure VMs if the on-premises datacenter experiences a complete site-level disaster, minimizing downtime and administrative overhead.

❌ **Why Other Options are Wrong:**
- **High Availability (HA) clustering:** On-premises HA clustering (Failover Clustering) protects against individual server hardware failures, but cannot keep workloads running if the whole on-premises site fails unless an expensive multi-site stretch cluster is maintained with heavy maintenance overhead.
- **Volume Shadow Copy Service (VSS):** VSS creates local snapshots on the same machine/host. If the on-premises site or host hardware fails, local shadow copies are destroyed.
- **Storage Replica:** Storage Replica is a Windows Server block-level replication feature that requires managing secondary on-premises or IaaS storage hardware clusters, incurring high configuration complexity and maintenance.

📚 **References:**
- *Design for Azure Site Recovery*
- *What is the Azure Backup service?*
- *Failover Clustering in Windows Server and Azure Stack HCI*
- *Volume Shadow Copy Service*
- *Storage Replica Overview*

---

### Question 21: Solution Evaluation - SQL Server Cloud Migration (3-4 TB)
- **Domain:** Design Business Continuity Solutions
- **Type:** Case Study / Solution Evaluation Series

#### 📋 Scenario:
Your company has an on-premises SQL Server 2019 instance hosted on a dedicated server running Windows Server 2019 Datacenter edition. The database supports a high-volume transaction processing application with hundreds of users connecting to the database at any time. User connections and transaction volume are expected to grow rapidly as your company expands. Rather than investing in new on-premises resources, the company decides to move the database to the cloud.

The database currently contains 3 TB of data and is expected to grow to no more than 4 TB. The solution should support at least one read-only replica in addition to the primary read-write database.

You need to deploy the database to Azure and meet the requirements.

> *This case study contains a series of questions that present the same scenario. Each question in the series contains a unique solution that might meet the stated goals. Note: You cannot go back or review questions of this type on the actual certification exam.*

##### Part 1:
**Proposed Solution:** Deploy an Azure SQL Database under the DTU-based purchasing model and choose the Premium service P6 tier.

**Question:** Does this solution meet the goal?

**Options:**
- [ ] **Yes**
- [x] **No** *(Correct)*

💡 **Explanation:**
This solution does NOT meet the goal. Under the DTU-based model, the Premium P6 tier has a maximum storage limit of 500 GB (or 1 TB max), which cannot accommodate a 3 TB database growing to 4 TB (only P11 and P15 support up to 4 TB in DTU Premium).

##### Part 2:
**Proposed Solution:** Deploy an Azure SQL Database under the vCore-based purchasing model and choose the Hyperscale service tier.

**Question:** Does this solution meet the goal?

**Options:**
- [x] **Yes** *(Correct)*
- [ ] **No**

💡 **Explanation:**
This solution MEETS all requirements:
1. Storage Capacity: Hyperscale supports databases up to 100 TB (effortlessly handling the 3 TB to 4 TB requirement with auto-scaling multi-tiered storage).
2. Read Scale-Out: Hyperscale natively supports up to four (4) read-only replicas in addition to the primary read-write node.
3. High-Volume OLTP: Hyperscale decouples compute and storage, providing rapid log generation throughput and near-instant backups regardless of database size.

##### Part 3:
**Proposed Solution:** Deploy an Azure SQL Managed Instance under the vCore-based purchasing model and choose the Business Critical service tier.

**Question:** Does this solution meet the goal?

**Options:**
- [x] **Yes** *(Correct)*
- [ ] **No**

💡 **Explanation:**
This solution MEETS all requirements:
1. Storage Capacity: SQL Managed Instance Business Critical supports up to 5.5 TB (and up to 16 TB on Premium-series hardware), which accommodates 4 TB of data.
2. Read Scale-Out: Business Critical includes a built-in free readable secondary replica (via Always On availability group architecture) accessible via ApplicationIntent=ReadOnly in connection strings.
3. High-Volume OLTP: Business Critical uses local high-speed NVMe SSD storage with low I/O latency for mission-critical transactional performance.

📚 **References:**
- *DTU-based purchasing model overview*
- *vCore purchasing model - Azure SQL Database*
- *Hyperscale service tier*
- *Resource limits for single databases using the DTU purchasing model - Azure SQL Database*

---

### Question 22: Azure Site Recovery: Multi-Tier Orchestration (Recovery Plans) & Low RTO (<15 min)
- **Domain:** Design Business Continuity Solutions
- **Type:** Multiple Choice

#### Question:
Your company runs a three-tier application on several virtual machines in the East US region. If the primary region becomes unavailable, the application must fail over to the West US region with a recovery time objective of less than 15 minutes. The recovery must be orchestrated across the tiers and must keep crash-consistent recovery points across all virtual machines.

You need to recommend a solution that meets these requirements.

What should you recommend?

#### Options:
- [ ] **Azure Site Recovery without a recovery plan**
- [ ] **Azure Backup with cross-region restore enabled**
- [x] **Azure Site Recovery with continuous replication** *(Correct)*
- [ ] **A zone-redundant deployment across availability zones**

💡 **Explanation:**
You should recommend Azure Site Recovery with continuous replication. ASR continuously syncs disk blocks to the target paired region to meet tight RTO (< 15 minutes) and RPO targets. It utilizes Multi-VM consistency groups to generate crash-consistent points across all interdependent tier VMs, and uses ASR Recovery Plans to orchestrate ordered failover across tiers (e.g., database tier first, then application tier, then web tier).

❌ **Why Other Options are Wrong:**
- **Azure Backup with cross-region restore enabled:** Azure Backup CRR restores VMs from point-in-time backup snapshots. Backup replication to secondary storage can lag by hours and size-of-data disk restoration takes far too long to satisfy an aggressive 15-minute RTO.
- **Azure Site Recovery without a recovery plan:** Without an ASR Recovery Plan, VM failovers are uncoordinated and simultaneous, failing to orchestrate the proper dependency startup order across the 3 tiers.
- **A zone-redundant deployment across availability zones:** Zone redundancy protects against single datacenter failures within the same East US region; it provides no cross-region disaster recovery to West US during a region-wide outage.

📚 **References:**
- *Common questions about Azure-to-Azure disaster recovery*
- *Create and configure a Recovery Services vault*
- *Replicate Azure VMs to another Azure region*
- *What are availability zones?*

---

### Question 23: Data Residency, Azure Region Pairs & Geo-Political Boundaries (GRS vs ZRS)
- **Domain:** Design Governance and Monitoring Solutions
- **Type:** Yes/No Statements

#### Question:
You work for a large multi-national company that deals with highly sensitive data. Due to various regulations, the data that is collected and used by your company must remain within the country in which it is generated.

You are developing disaster recovery (DR) plans and you need to determine a strategy to geographically distribute data and backups in order to meet DR and regulatory requirements. Initially, costs are not a concern.

You need to choose the storage replication features for your company's data.

For each of the following statements, select Yes if the statement is true. Otherwise, select No.

#### Statements & Answers:
- **An Azure region that another region is paired with is nearly always located in the same geo-political area.:** `Yes`
  - *Explanation:* Azure regional pairs are almost always intentionally established within the same geopolitical/national boundary (e.g., East US paired with West US, UK South paired with UK West, North Europe with West Europe) to preserve regulatory data residency.
- **Automatic data replication via Azure geo-redundant storage (GRS) guarantees that the data remains within the same geo-political boundaries.:** `No`
  - *Explanation:* GRS does NOT guarantee data remains within the same country across all regions. For example, Brazil South is paired with South Central US (located in the United States), which crosses geopolitical borders.
- **If you want to reduce data storage costs and maintain intra-region redundancy, Azure zone-redundant storage (ZRS) can be used.:** `Yes`
  - *Explanation:* Zone-redundant storage (ZRS) replicates data synchronously across three availability zones within the same local region, maintaining strict intra-region data residency at lower cost than cross-region GRS.

📚 **References:**
- *Cross-region replication in Azure: Business continuity and disaster recovery*
- *Azure Storage redundancy*

---

### Question 24: Resource Locks (CanNotDelete) vs Data Plane Blob/Container Protection
- **Domain:** Design Business Continuity Solutions
- **Type:** Yes/No Statements

#### Question:
Your company has an Azure environment. An administrator accidentally deletes a storage account named mystorageaccount1 containing important financial information. You successfully recover mystorageaccount1 and configure it to prevent accidental deletion in the future. You then execute the following command to verify your configuration and get the following output:

az lock list --resource "/subscriptions/<ID>/resourceGroups/myresourcegroup1/providers/Microsoft.Storage/storageAccounts/mystorageaccount1"

[
  {
    "id": "/subscriptions/<ID>/resourceGroups/myresourcegroup1/providers/Microsoft.Storage/storageAccounts/mystorageaccount1/providers/Microsoft.Authorization/locks/AzureBackupProtectionLock",
    "level": "CanNotDelete",
    "name": "AzureBackupProtectionLock",
    "notes": "Auto-created by Azure Backup for storage accounts registered with Recovery Services Vault. This lock guards against backup deletion due to accidental deletion of storage account.",
    "owners": null,
    "resourceGroup": "myresourcegroup1",
    "type": "Microsoft.Authorization/locks"
  }
]

For each of the following statements, select Yes if the statement is true. Otherwise, select No.

#### Statements & Answers:
- **Users are prevented from deleting mystorageaccount1.:** `Yes`
  - *Explanation:* The 'CanNotDelete' lock applied at the ARM resource level explicitly prevents any administrator or process from deleting the storage account resource until the lock is removed.
- **Users are prevented from deleting or overwriting containers or blobs within mystorageaccount1.:** `No`
  - *Explanation:* ARM Resource Locks operate strictly at the control plane (management plane). A CanNotDelete lock on a storage account does NOT block data plane operations; authorized users can still create, modify, overwrite, or delete individual containers and blobs inside the account (which requires Blob Immutability/WORM or Soft Delete).
- **Users are prevented from reading or modifying mystorageaccount1's configuration.:** `No`
  - *Explanation:* A 'CanNotDelete' lock only prevents deletion. Authorized users can still read and modify the storage account's configuration (such as network firewalls, tags, or access tiers). To block configuration changes, a 'ReadOnly' lock would be required.

📚 **References:**
- *Apply an Azure Resource Manager lock to a storage account*
- *Data protection overview*
- *Enable and manage soft delete for containers*

---

### Question 25: Azure Cosmos DB Consistency Levels: Bounded Staleness vs Strong
- **Domain:** Design Relational and Non-Relational Data Storage Solutions
- **Type:** Multiple Choice

#### Question:
You operate distributed Azure Cosmos DB for a product catalog for suppliers of automotive parts worldwide. Attributes for specific parts are changed by the development department using the primary replica of Azure Cosmos DB in Europe and replicated to all secondary read-only replicas in other regions.

You need to recommend a high availability solution to guarantee returning the most recent version of the data in a region, while providing flexibility in managing replication lag and network latency.

Which consistency level should you recommend?

#### Options:
- [ ] **Eventual**
- [ ] **Consistent prefix**
- [ ] **Strong**
- [x] **Bounded staleness** *(Correct)*

💡 **Explanation:**
You should recommend Bounded Staleness consistency. Bounded staleness allows administrators to explicitly tune and configure the maximum acceptable replication lag either by a number of item versions (K) or a time interval (T). In the local primary region (Europe), reads are strongly consistent and guarantee returning the most recent version of the data, while in secondary regions, reads are guaranteed never to lag beyond the specified (K versions or T time) bound, providing ideal architectural flexibility to balance replication lag and WAN network latency.

❌ **Why Other Options are Wrong:**
- **Strong:** Strong consistency enforces synchronous global linearizability (RPO = 0) with zero lag across all regions. However, it incurs high write latency across cross-continental regions and does not allow configurable flexibility in managing replication lag or latency bounds.
- **Eventual:** Eventual consistency offers maximum flexibility and lowest latency, but provides zero ordering or staleness guarantees and cannot guarantee returning the most recent data version.
- **Consistent prefix:** Consistent prefix guarantees that clients never see out-of-order writes, but provides no configurable upper bound on how far behind the secondary replicas can lag.

📚 **References:**
- *Consistency levels in Azure Cosmos DB*
- *Databases, containers, and items in Azure Cosmos DB*
- *Classify your data*

---

### Question 26: Storage Security: Service SAS (Principle of Least Privilege) & Storage Firewall Rules
- **Domain:** Design Non-Relational Data Storage Solutions
- **Type:** Multiple Choice (Select Two)

#### Question:
A company hosts an e-commerce website that uses Azure Content Delivery Network (CDN) to serve the photos and videos of the products from the catalog. A storage account named assetstrg is used to store all of the photos and videos. The product catalog managers use custom scripts to upload the photos and videos of a product.

You need to recommend a solution that provides the product catalog managers with access that only allows them to upload the new files to the storage account from the Company's office network.

Which two security solutions should you recommend? Each correct answer presents part of the solution.

#### Options:
- [x] **Use service shared access signature (SAS).** *(Correct)*
- [ ] **Enable secure transfer.**
- [ ] **Use account shared access signature (SAS).**
- [x] **Enable firewall policies and rules.** *(Correct)*
- [ ] **Enforce the minimum TLS version.**
- [ ] **Use access keys.**

💡 **Explanation:**
You should recommend using service shared access signature (SAS). A service SAS provides fine-grained control to access the resources in a storage account. It also allows you to set the start and end date of the token. With service SAS, you can limit access to the blob service in the storage account. Since the product catalog managers only need access to add the new files, a service SAS token for blob service with Add permissions can be created with a short expiry time.

You should also recommend enabling firewall policies and rules. By default, the storage account is available from all networks, including the internet. You can define the containers' public access levels to restrict who can access the blobs in the container. For further security, you can also put network restrictions on the storage account. You can add the IP address range of the company's network such that the storage account is only accessible from the office.

The CDN allows the photos and videos to be served from one of the many points of presence (PoP) locations that are closer to the user accessing the website. The content is cached in these PoP locations from the storage account assetstrg. This improves user experience as the website loads faster, which means greater engagement and value for the business.

❌ **Why Other Options are Wrong:**
- **Use account shared access signature (SAS).:** Account SAS is used when access to one or more storage account services is required. This solution can fulfill similar requirements to a service SAS, but it also provides access to other storage account services like queues, tables, and files. A better solution for this scenario is to create a service SAS.
- **Use access keys.:** Access keys are equivalent to super administrator credentials, which allow a user to perform any activity and operation on the storage account. Since the product catalog managers only need to upload the photos and videos, you should follow the principle of least privilege and provide them with upload access only using a service SAS.
- **Enable secure transfer.:** This setting is enabled by default and it ensures that any requests made to the storage account are made using HTTPS protocol. The storage account is available via HTTP protocol, as well, but this is an insecure way to communicate with the storage account. Even though it is recommended to use secure communication, it does not meet the scenario's goals.
- **Enforce the minimum TLS version.:** Since HTTPS connections are enabled by default, the storage account allows all the TLS versions for backward compatibility for the client connections.

📚 **References:**
- *Delegate access with a shared access signature*
- *Configure Azure Storage firewalls and virtual networks*
- *Create a service SAS*
- *Create an account SAS*

---

### Question 27: Hybrid Connectivity & Private Ingestion: ExpressRoute & Private Endpoints
- **Domain:** Design Infrastructure Solutions
- **Type:** Multiple Choice (Select Two)

#### Question:
Your client plans to migrate on-premises databases and other services to the Azure cloud. To enhance data security, you have been hired to design a solution that will allow the data to be copied from the on-premises servers to Azure endpoints.

Your solution must meet the following requirements:
- Data must not be sent across the public internet.
- The solution should offer a minimum of 5 Gbps bandwidth.
- Latency should be reduced as much as possible.

You need to recommend which tasks to include in your solution.

Which two tasks should you recommend? Each correct answer presents part of the solution.

#### Options:
- [ ] **Create a virtual network service endpoint.**
- [ ] **Deploy a P2S VPN gateway.**
- [x] **Create private endpoints for the target Azure services.** *(Correct)*
- [ ] **Create a Private Link service.**
- [x] **Implement Azure ExpressRoute.** *(Correct)*

💡 **Explanation:**
You should recommend Azure ExpressRoute and Private Endpoints for the target Azure services:
1. Azure ExpressRoute: Extends on-premises networks directly to Azure over a dedicated, private fiber connection (never traverses the public internet), provides low latency, and easily supports bandwidth demands exceeding 5 Gbps (standard circuits up to 10 Gbps, ExpressRoute Direct up to 100/400 Gbps).
2. Private Endpoints: Provisions private IP addresses within your Azure VNet for target Azure PaaS services (e.g., Azure SQL, Blob Storage). On-premises servers communicate over ExpressRoute directly to these private IPs, ensuring end-to-end private data migration.

❌ **Why Other Options are Wrong:**
- **Create a Private Link service.:** A Private Link Service is the provider-side resource used to expose custom backend applications behind a Standard Internal Load Balancer to external consumers. The client is a consumer of standard Azure PaaS services here, so Private Endpoints are required, not a Private Link service.
- **Create a virtual network service endpoint.:** Service Endpoints do not extend to on-premises networks over ExpressRoute or VPN; they only route traffic from within the Azure VNet to the public IPs of Azure PaaS services over the backbone.
- **Deploy a P2S VPN gateway.:** Point-to-Site (P2S) VPN is designed for individual remote worker laptops connecting to Azure, cannot meet a 5 Gbps bandwidth requirement (VPN Gateway is capped at ~1.25 to 10 Gbps across S2S tunnels), and traverses public internet.

📚 **References:**
- *What is Azure ExpressRoute?*
- *What is Azure Private Endpoint?*
- *What is Azure Private Link service?*

---


---

## Question 28: Global Traffic Routing: Azure Traffic Manager vs Azure Front Door (Nearest Geographic Instance)
- **Domain:** Design Infrastructure Solutions
- **Type:** Multiple Choice (Select Two)

#### Question:
Your company developed a web app named App1 and initially hosted the app on premises. Your company now deploys App1 to virtual machines (VMs) in the North Central US, South Central US, West Central US, and West US Azure regions.

You need to configure a solution that has users connect with the nearest geographically available instance of App1.

Which two solutions can you use? Each correct answer presents a complete solution.

#### Options:
- [ ] Azure Application Gateway
- [x] Azure Traffic Manager
- [ ] Azure DNS
- [x] Azure Front Door

#### Correct Answers:
- **`Azure Traffic Manager`**
- **`Azure Front Door`**

💡 **Explanation:**
You should configure Azure Traffic Manager or Azure Front Door.
- In **Azure Traffic Manager**, the **Performance** traffic-routing method determines the closest endpoint by measuring network latency across the internet and returns the available endpoint with the lowest latency in the DNS response.
- In **Azure Front Door**, the **Latency** traffic-routing method forwards each request to the origins with lowest latency within an acceptable sensitivity range.
Either solution connects users with the nearest available instance of App1 across multiple regions.

❌ **Why the other options are incorrect:**
- **Azure Application Gateway:** Application Gateway is a regional service operating within a single virtual network; it cannot distribute traffic across multiple global Azure regions through a single control plane.
- **Azure DNS:** Azure DNS provides authoritative domain name resolution, but does not provide dynamic latency-based or geographic routing methods.

📚 **References:**
- *Overview of Azure load-balancing options*
- *Traffic Manager routing methods*
- *Routing architecture overview - Azure Front Door*

---

## Question 29: Azure API Management: Virtual Network Injection vs Integration (Premium v2 Tier Isolation)
- **Domain:** Design Infrastructure Solutions
- **Type:** Multiple Choice

#### Question:
Your company exposes several backend APIs that are isolated in a virtual network with no public access.

You need to recommend an Azure API Management tier that injects the gateway into the virtual network so that both inbound and outbound gateway traffic stay fully isolated from the internet.

What should you recommend?

#### Options:
- [x] The Premium v2 tier
- [ ] The Consumption tier
- [ ] The Developer tier
- [ ] The Standard v2 tier

#### Correct Answer:
- **`The Premium v2 tier`**

💡 **Explanation:**
You should recommend the **Premium v2 tier**. The Premium v2 tier supports **virtual network injection** (internal VNet mode), which places the API Management gateway directly inside your virtual network. This guarantees that both inbound API client traffic and outbound backend API traffic remain completely isolated from the public internet.

❌ **Why the other options are incorrect:**
- **The Standard v2 tier:** Supports virtual network integration (outbound access to private backends), but its gateway endpoint remains publicly exposed to the internet.
- **The Consumption tier:** A multi-tenant serverless tier that does not support virtual network injection.
- **The Developer tier:** Evaluation/development tier with no Service Level Agreement (SLA); not suitable for production isolation.

📚 **References:**
- *API Management tiers overview*
- *Virtual network injection in Azure API Management*
- *API Management v2 tier overview*

---

## Question 30: Cross-Region Automated Failover: Traffic Manager with Priority Routing
- **Domain:** Design Infrastructure Solutions
- **Type:** Dropdown / Hotspot

#### Question:
CompanyA operates an online shop with the majority of customers in the US and Asia. You plan to move your on-premises online shop web application to Azure and deploy it in the East US and West US regions. Your solution must meet the following requirements:
- East US region is the primary region where all the customer requests should go.
- If the East US region fails, the web application in the West US region must take over the operation automatically.

You need to recommend a solution for the online shop web application.

What should you include in the recommendation? To answer, select the appropriate options from the drop-down menus.

#### Dropdown Sentence Formats & Options:
1. **Routing configuration: [ -Select- ]**
   - *Options:* `Azure Traffic Manager` | `Azure Load Balancer` | `round-robin load balancing`
   - **Correct Answer:** `Azure Traffic Manager`
   - *Explanation:* Azure Traffic Manager is a DNS-based traffic load balancer that operates across geographic regions to direct traffic between East US and West US. Azure Load Balancer operates at Layer 4 within a single region and cannot balance across regions.

2. **Routing method: [ -Select- ]**
   - *Options:* `Priority routing` | `Weighted routing` | `Multivalue routing`
   - **Correct Answer:** `Priority routing`
   - *Explanation:* Priority routing allows configuring East US with priority #1 (receives 100% of traffic) and West US with priority #2 (backup failover). If East US fails health checks, traffic automatically shifts to West US.

📚 **References:**
- *Traffic Manager routing methods - Priority*
- *Azure Traffic Manager overview*
- *Comparing Azure load-balancing services*

---

## Question 31: Regional Layer 7 Routing: Application Gateway Path-Based Routing (/videos/* & /images/*)
- **Domain:** Design Infrastructure Solutions
- **Type:** Multiple Choice

#### Question:
You are designing the network layer of a multi-tier application in Azure:
- Two internet-facing web front ends.
- Two App Service apps that form the middle tier. One serves videos under the path /videos/* and the other serves images under the path /images/*. Middle-tier requests must reach the app that matches the requested path.
- A SQL database in the back end.

The front ends already use Azure Front Door. The two middle-tier apps run in a single Azure region.

You need to recommend how to distribute traffic to the middle tier.

What should you recommend?

#### Options:
- [ ] Azure Front Door
- [x] Azure Application Gateway
- [ ] Azure Load Balancer
- [ ] Azure Traffic manager

#### Correct Answer:
- **`Azure Application Gateway`**

💡 **Explanation:**
You should recommend **Azure Application Gateway**. Application Gateway is a regional Layer 7 load balancer that terminates the HTTP session and inspects the URL path (`/videos/*` and `/images/*`) to route requests to specific backend pools. Because the middle tier runs inside a single Azure region, Application Gateway is the ideal regional Layer 7 solution.

❌ **Why the other options are incorrect:**
- **Azure Front Door:** A global ingress service. Front Door is already used at the edge; adding a second Front Door hop inside the same region for intra-region routing introduces unnecessary latency and cost.
- **Azure Load Balancer:** Operates at Layer 4 (TCP/UDP) using 5-tuple hash and cannot inspect HTTP request URLs or route on paths.
- **Azure Traffic Manager:** A DNS-level resolution service; it returns IP addresses before HTTP requests are sent and never inspects HTTP paths.

📚 **References:**
- *Azure Application Gateway URL path-based routing overview*
- *Load balancing options in Azure*
- *Azure Application Gateway features*

---

## Question 32: Automated VM Provisioning: Terraform (IaC) & Packer with Ansible Provisioner (Custom Golden Image)
- **Domain:** Design Infrastructure Solutions
- **Type:** Multiple Choice (Select Two)

#### Question:
You work as an architect for a company that is planning to lift and shift their 100-VM workload from an on-premises environment to Azure.

The operations team wants to reduce the time that it takes to configure and deploy these VMs in Azure.

You need to recommend a solution based on following requirements:
- VMs should be deployed using Infrastructure as Code (IAC).
- Custom image should be used to deploy the VMs.
- Existing Ansible playbooks should be used.

Which two options should you recommend? Each correct answer presents part of the solution.

#### Options:
- [x] Packer
- [ ] Chef
- [x] Terraform
- [ ] Ansible
- [ ] Azure Automation

#### Correct Answers:
- **`Packer`**
- **`Terraform`**

💡 **Explanation:**
You should recommend **Terraform** and **Packer**:
1. **Terraform:** The primary Infrastructure as Code (IaC) tool for provisioning Azure resources using declarative HCL modules, ensuring repeatable, automated deployments of all 100 VMs.
2. **Packer:** Automated image builder from HashiCorp that bakes custom golden VM images. Packer natively includes an **Ansible provisioner** (`provisioner "ansible"`), allowing the team to directly reuse their existing Ansible playbooks during the image build pipeline.

❌ **Why the other options are incorrect:**
- **Ansible:** While the playbooks are reused, they run inside Packer's Ansible provisioner rather than acting as the overarching IaC infrastructure provisioning tool for Azure.
- **Chef:** An alternative agent-based configuration tool; cannot reuse existing Ansible playbooks.
- **Azure Automation:** Configures running VMs using PowerShell DSC; cannot reuse Ansible playbooks.

📚 **References:**
- *Use Terraform to create an Azure VM*
- *Packer Ansible Provisioner documentation*
- *How to use Packer to create Linux virtual machine images in Azure*


---

## Question 33: Outbound Internet Connectivity: Virtual Network NAT Gateway (SNAT Port Exhaustion Prevention)
- **Domain:** Design Infrastructure Solutions
- **Type:** Multiple Choice

#### Question:
You run a batch application on 50 Azure virtual machines in a single subnet. The virtual machines must make many outbound connections to external package repositories over the internet, with a stable outbound IP address and no source network address translation (SNAT) port exhaustion at scale.

You need to recommend a solution that minimizes cost and management complexity.

What should you recommend?

#### Options:
- [ ] A public IP address on each virtual machine
- [x] A NAT gateway on the subnet
- [ ] Azure Firewall for outbound traffic
- [ ] Standard Load Balancer outbound rules

#### Correct Answer:
- **`A NAT gateway on the subnet`**

💡 **Explanation:**
You should recommend a **NAT gateway on the subnet**. Virtual Network NAT gateway provides a dedicated, static public IP address (or prefix) and dynamic SNAT port allocation (up to 64,512 ports per IP address). Because ports are shared on demand across all VMs in the subnet rather than statically pre-allocated per VM, it prevents SNAT port exhaustion during bursty outbound batch traffic while keeping costs and operational overhead low.

❌ **Why the other options are incorrect:**
- **A public IP address on each virtual machine:** Greatly increases the network attack surface, requires managing 50 public IPs, and does not provide a single stable outbound IP address.
- **Standard Load Balancer outbound rules:** Uses fixed, pre-allocated SNAT ports per VM instance. Under heavy outbound batch traffic across 50 VMs, static allocation frequently triggers SNAT port exhaustion.
- **Azure Firewall for outbound traffic:** While capable of outbound SNAT, Azure Firewall is designed for deep packet inspection, threat intelligence, and enterprise-grade policy filtering. It is much more expensive and complex than necessary when the only goal is stable, high-scale outbound internet egress.

📚 **References:**
- *What is Virtual Network NAT?*
- *Design virtual networks with NAT gateway*
- *Troubleshoot SNAT port exhaustion with Azure Virtual Network NAT*

---

## Question 34: Solution Evaluation - Hybrid Connectivity for LOB/ERP (Remote Workers & Main Office)
- **Domain:** Design Infrastructure Solutions
- **Type:** Case Study / Solution Evaluation Series

#### 📋 Scenario:
Your company has a Line of Business (LOB) application running in the Azure cloud. The application should be integrated with an enterprise resource planning (ERP) system running from your company's on-premises main office. Due to compliance reasons, these applications must not be published to public endpoints and must be reachable only from private, corporate-managed connections. Your company's main office has 500 workstations and 100 employees working from home with company-managed laptops that use the LOB application.

You need to configure a connectivity solution that meets the following requirements:
- Provide all employees working from home with secure connectivity to cloud-based and on-premises services.
- Connect the on-premises main office to the Azure network.

*(Note: This case study contains a series of questions that present the same scenario. Each question in the series contains a unique solution that might meet the stated goals. You cannot go back or review questions of this type on the actual certification exam.)*

---

### Part 1:
- **Proposed Solution:** You configure a Point-to-Site (P2S) VPN connection for remote employees and a Site-to-Site VPN connection between Azure and the main office network.
- **Question:** Does this solution meet the goal?
- **Answer:** **`Yes`**
- 💡 **Explanation:** This solution meets the goal. A Point-to-Site (P2S) VPN tunnel connects individual remote worker laptops securely into the Azure Virtual Network Gateway without publishing applications to public endpoints. A Site-to-Site (S2S) IPSec/IKE VPN connects the main office network to Azure, providing private, encrypted connectivity between the LOB application in Azure and the on-premises ERP system.

---

### Part 2:
- **Proposed Solution:** You configure an ExpressRoute connection for the remote employees and between Azure and the main office network.
- **Question:** Does this solution meet the goal?
- **Answer:** **`No`**
- 💡 **Explanation:** This solution does NOT meet the goal. While ExpressRoute provides a dedicated private circuit for the main office, it cannot be used for individual remote employees working from home. ExpressRoute requires dedicated physical circuits, WAN edge routers, and co-location provider connectivity, which is impossible and cost-prohibitive to deploy at 100 private homes.

---

### Part 3:
- **Proposed Solution:** You configure a Point-to-Site (P2S) VPN connection for the remote employees and an ExpressRoute between Azure and the main office network.
- **Question:** Does this solution meet the goal?
- **Answer:** **`Yes`**
- 💡 **Explanation:** This solution meets the goal. Point-to-Site (P2S) VPN provides secure, private client-to-gateway tunneling for the 100 remote home workers, and ExpressRoute provides high-throughput, private, dedicated cross-premises connectivity between the 500-workstation main office and the Azure cloud.

📚 **References:**
- *About Point-to-Site VPN*
- *About Site-to-Site VPN*
- *ExpressRoute overview*
- *Coexistence of ExpressRoute and Site-to-Site VPN connections*


---

## Question 35: Enterprise Messaging: Azure Service Bus FIFO Message Sessions & Backlog Ordering
- **Domain:** Design Infrastructure Solutions
- **Type:** Multiple Choice

#### Question:
You are developing a transaction processing application to handle back-end processing activity for your company's projected new online sales system. The application will integrate multiple Azure cloud services in an orchestrated solution to handle different components of the sales and fulfilment process. The application must support asynchronous communication passing transaction activity information between different cloud services through messages.

You need to recommend a solution to facilitate communication that can handle a backlog of up to thousands of messages at any time and messages are consumed in order.

What should you recommend?

#### Options:
- [ ] Azure Queue Storage
- [ ] Azure Notification Hubs
- [ ] Azure Event Hubs
- [x] Azure Service Bus

#### Correct Answer:
- **`Azure Service Bus`**

💡 **Explanation:**
You should recommend **Azure Service Bus**. Azure Service Bus queues support First-In-First-Out (FIFO) message ordering and transactional delivery through **message sessions** (`SessionId`). When message sessions are enabled, Service Bus guarantees that all messages belonging to the same session are consumed in strict arrival order across thousands of queued messages.

❌ **Why the other options are incorrect:**
- **Azure Queue Storage:** Provides loose ordering; does not guarantee strict FIFO ordering or session-based ordering.
- **Azure Notification Hubs:** A push notification engine for broadcasting notifications to mobile devices, not a transactional message broker.
- **Azure Event Hubs:** An event streaming engine designed for high-throughput stream ingestion (partitioned) rather than enterprise transactional message queuing with FIFO sessions.

📚 **References:**
- *Azure Service Bus message sessions*
- *Compare Azure messaging services*
- *Storage queues and Service Bus queues - compared and contrasted*

---

## Question 36: Hybrid Application Migration: Azure App Service & Azure Relay for Private On-Premises Connectivity
- **Domain:** Design Infrastructure Solutions
- **Type:** Dropdown / Hotspot

#### Question:
A company is migrating several of its existing web services to the cloud. Its other web services must still be hosted on-premises, but they must be visible in Azure.

All the migrated services contain simple logic. Because of time constraints, no code can be changed. To ensure business continuity, the migrated services need to scale independently when web requests increase.

You need to build a solution that meets these requirements.

Which deployment option should you recommend for the migrated services and how should the services be made visible in Azure? To answer, select the appropriate options from the drop-down menus.

#### Dropdown Sentence Formats & Options:
1. **The migrated service should be deployed: [ -Select- ]**
   - *Options:* `as Azure app services` | `as Azure functions` | `to Azure VMs`
   - **Correct Answer:** `as Azure app services`
   - *Explanation:* Azure App Service allows deploying existing web services directly without requiring code refactoring or rewrites, and supports independent automatic scale-out as web traffic surges.

2. **To make the on-premises services visible in Azure, you should install: [ -Select- ]**
   - *Options:* `Azure Relay` | `Application Gateway` | `Azure Load Balancer`
   - **Correct Answer:** `Azure Relay`
   - *Explanation:* Azure Relay securely exposes on-premises web services to Azure via outbound TCP port 443/5671 connections without needing inbound firewall openings or changes to corporate network infrastructure.

📚 **References:**
- *Azure App Service overview*
- *What is Azure Relay?*
- *Connect an on-premises WCF/HTTP service to Azure Relay*

---

## Question 37: Azure Data Factory: Self-Hosted Integration Runtime (SHIR) Architecture & Host Requirements
- **Domain:** Design Infrastructure Solutions
- **Type:** Yes/No Statements

#### Question:
You are designing a data migration project that will move 1TB of data from multiple on-premises servers, FILESRV_HR and ARCHIVE_SRV1, to Azure Storage. To facilitate this process, you plan to utilize Azure Data Factory. You must now outline the requirements for self-hosted integration runtimes.

For each of the following statements, select Yes if the statement is true. Otherwise, select No.

#### Statements & Answers:
- **You must configure two self-hosted integration runtimes, one each for FILESRV_HR and ARCHIVE_SRV1:** **`No`**
  - *Explanation:* A single self-hosted integration runtime can connect to multiple on-premises data sources simultaneously. There is no requirement to configure a separate SHIR for each source server.
- **You must install each self-hosted integration runtime on a separate Windows machine:** **`Yes`**
  - *Explanation:* Only one SHIR node instance can run on a single Windows OS machine. If you configure multiple runtimes or multiple scale-out nodes, each must reside on a separate Windows machine.
- **You must install a self-hosted integration runtime on FILESRV_HR and on ARCHIVE_SRV1:** **`No`**
  - *Explanation:* The SHIR does not need to be installed on the source servers themselves; it can reside on any dedicated Windows server in the local network with line-of-sight connectivity to the sources.

📚 **References:**
- *Create and configure a self-hosted integration runtime*
- *High availability and scalability with self-hosted integration runtime in Azure Data Factory*

---

## Question 38: Azure Managed Redis: Active Geo-Replication & Data Persistence (RDB/AOF)
- **Domain:** Design Infrastructure Solutions
- **Type:** Multiple Choice (Select Two)

#### Question:
Your company runs a globally distributed application backed by Azure Managed Redis. The cache must keep serving reads and writes if an entire region fails, and it must be able to recover its data after a restart.

You need to recommend a solution.

Which two solutions you recommend? Each correct answer presents part of the solution.

#### Options:
- [ ] A larger cache in one region
- [x] Data persistence using RDB or AOF
- [ ] Locally redundant storage for the cache
- [ ] A single-region cache with no replica
- [x] Active geo-replication between the regions

#### Correct Answers:
- **`Data persistence using RDB or AOF`**
- **`Active geo-replication between the regions`**

💡 **Explanation:**
You should recommend Active Geo-Replication between regions and Data Persistence using RDB or AOF:
1. **Active Geo-Replication:** Replicates cache data across multiple regions in an active-active topology using Conflict-Free Replicated Data Types (CRDTs), allowing the cache to continue serving both reads and writes if an entire region suffers an outage.
2. **Data Persistence (RDB/AOF):** Persists cache data to an Azure Storage account via Redis Database (RDB) snapshots or Append-Only File (AOF) logs, allowing Redis to rehydrate cached data upon restart or reboot instead of starting cold/empty.

❌ **Why the other options are incorrect:**
- **A larger cache in one region:** Does not protect against region failure or restore data after reboot.
- **Locally redundant storage for the cache:** LRS does not provide cross-region failover.
- **A single-region cache with no replica:** Offers zero high availability if the region fails.

📚 **References:**
- *Configure active geo-replication for Azure Managed Redis*
- *Configure data persistence for Azure Managed Redis*
- *High availability for Azure Managed Redis*

---

## Question 39: Hybrid Identity & Authentication: AD DS Domain Controller Extension to Azure VNet for Kerberos
- **Domain:** Design Infrastructure Solutions
- **Type:** Multiple Choice

#### Question:
Your company has an Active Directory Domain Services (AD DS) forest with a single domain, named company.com, that has multiple geographic locations. The forest functional level is Windows Server 2016. On-premises applications include legacy applications that rely on AD DS and Kerberos authentication. The company's business plan does not include rewriting or replacing the applications.

Your company is investigating options for moving what applications it has from on-premises to the cloud. The company acquires an Azure subscription. You do not configure Microsoft Entra ID.

As a test case, you must move the legacy applications to Azure, and configure a test environment that:
- Supports Kerberos authentication from the cloud without requiring on-premises access.
- Minimizes changes to the applications.
- Minimizes the additional AD management overhead.
- Minimizes the overall effort to configure the environment.

You configure a single virtual network (VNet) in Azure and a VPN Gateway site-to-site (S2S) connection between the VNet and the on-premises network. You need to configure an operational environment to test the applications.

What should you do?

#### Options:
- [ ] Configure a Microsoft Entra domain named company.com.
- [ ] Create a child domain of company.com on the existing VNet.
- [x] Deploy one or more domain controllers for company.com on the existing VNet.
- [ ] Create a new VNet, and create a new AD DS forest root domain on the new VNet.

#### Correct Answer:
- **`Deploy one or more domain controllers for company.com on the existing VNet.`**

💡 **Explanation:**
You should deploy one or more domain controllers for `company.com` on the existing VNet. Extending the existing AD DS forest by placing a domain controller in Azure and replicating directory data across the Site-to-Site VPN allows legacy cloud applications to authenticate directly against local cloud DCs via Kerberos without routing authentication queries back across the WAN to on-premises. This avoids introducing child domains, new forest trusts, or administrative overhead.

❌ **Why the other options are incorrect:**
- **Configure a Microsoft Entra domain named company.com:** Entra ID is not configured here and does not issue traditional on-premises Kerberos tickets without Entra Domain Services.
- **Create a child domain of company.com:** Introduces extra administrative and domain boundary overhead.
- **Create a new AD DS forest root domain:** Requires complex cross-forest trust configurations and management overhead.

📚 **References:**
- *Deploy AD DS in an Azure virtual network*
- *Extend an on-premises Active Directory domain to Azure*
- *Guidance for deploying Active Directory Domain Services on Azure VMs*

---

## Question 40: High-Performance Computing (HPC): Azure Batch for Parallel Job Scheduling & Compute Scaling
- **Domain:** Design Infrastructure Solutions
- **Type:** Multiple Choice

#### Question:
You are designing a high-performance computing (HPC) workload that will be used to support complex engineering projects. The workload runs multiple applications as an intrinsically parallel workload.

You need to select an application service to support the workload. The solution should manage job scheduling. You want to minimize costs related to the solution.

What should you use?

#### Options:
- [x] Azure Batch
- [ ] Azure Functions
- [ ] Azure Virtual Machine Scale Sets
- [ ] Azure Kubernetes Service (AKS) clusters

#### Correct Answer:
- **`Azure Batch`**

💡 **Explanation:**
You should use **Azure Batch**. Azure Batch is designed specifically for large-scale parallel and high-performance computing (HPC) batch workloads. Batch provisions compute pools of VMs, installs application packages, and automatically manages job queues and task scheduling. Furthermore, there is zero platform fee for Azure Batch itself—you only pay for the underlying VM compute resources utilized, satisfying the cost-minimization requirement.

❌ **Why the other options are incorrect:**
- **Azure Functions:** Tailored for lightweight, event-triggered short-running tasks; not suited for compute-intensive HPC engineering jobs.
- **Azure Virtual Machine Scale Sets:** Scales VMs, but provides no native job scheduler or task queuing for parallel batch workloads.
- **Azure Kubernetes Service (AKS) clusters:** Adds container management complexity and does not offer native parallel HPC job scheduling out of the box like Batch.

📚 **References:**
- *What is Azure Batch?*
- *High-performance computing (HPC) on Azure*
- *Batch service quota and limits*


---

## Question 41: Azure API Management Capabilities: Throttling (Rate Limiting), IP Filtering vs Backend Autoscaling
- **Domain:** Design Infrastructure Solutions
- **Type:** Yes/No Statements

#### Question:
You plan to move your company's API applications to Azure. Each API should be deployed in a specific Azure web app.

You have decided to implement Azure API Management.

For each of the following scenarios, select Yes if the feature is available in API Management. Otherwise, select No.

#### Statements & Answers:
- **Throttle the requests to an API:** **`Yes`**
  - *Explanation:* API Management provides built-in request throttling and rate limiting via policies such as `<rate-limit>` and `<rate-limit-by-key>` to limit calls per second/minute and protect backend APIs from spikes.
- **Allow only specific IP addresses to call the API:** **`Yes`**
  - *Explanation:* API Management supports inbound access restriction using the `<ip-filter>` policy, allowing you to permit or deny specific client IP addresses or CIDR blocks in a single centralized gateway.
- **Implement autoscaling for an API:** **`No`**
  - *Explanation:* API Management cannot autoscale your backend API applications. Autoscaling the API backend logic is accomplished by configuring horizontal autoscale rules on the underlying Azure App Service Plan.

📚 **References:**
- *Azure API Management policy reference - rate-limit*
- *Azure API Management policy reference - ip-filter*
- *Autoscale in Azure App Service*


---

## Question 42: High-Scale Compute: Virtual Machine Scale Sets with Custom Windows Server Image (300+ Instances)
- **Domain:** Design Infrastructure Solutions
- **Type:** Multiple Choice

#### Question:
An application was originally developed and deployed on-premises for its pilot release phase. You have determined that it would be more cost-effective and provide better support for rapid upscaling and downscaling to rehost the application in the cloud. Changes to the application must be kept to a minimum.

Processing requirements and the number of users supported can vary widely. Your deployment must be able to scale up to over 300 instances throughout a region. Traffic with the instances must be load balanced. The application requires a customized Windows 2019 Server image to support it. You have tested the custom image as a VM.

You need to determine the best way to deploy the application to Azure. You want to minimize costs and reduce management overhead.

What should you do?

#### Options:
- [ ] Create an Azure Resource Manager (ARM) template and a PowerShell script to deploy VM instances as required.
- [x] Create the deployment as a VM scale set.
- [ ] Package the application as a container application and deploy it to an AKS cluster.
- [ ] Package the application as a container application and deploy it to a container group in Azure Container Instances.

#### Correct Answer:
- **`Create the deployment as a VM scale set.`**

💡 **Explanation:**
You should create the deployment as a **Virtual Machine Scale Set (VMSS)**. VMSS natively provides automated horizontal scaling based on metrics, integrates directly with Azure Load Balancer, and supports custom VM images up to 600 instances (and up to 1,000 instances for marketplace platform images). This fulfills the 300-instance scale-out requirement with minimal management effort and zero application code modification.

❌ **Why the other options are incorrect:**
- **Create an ARM template and a PowerShell script:** Manual or scripted VM provisioning requires creating complex custom orchestration and maintenance scripts, creating massive administrative overhead and slow scaling.
- **Package as container for AKS / ACI:** Requires containerizing a legacy Windows Server 2019 VM application, which involves significant code and architecture refactoring, directly violating the requirement to minimize changes to the application.

📚 **References:**
- *What are virtual machine scale sets?*
- *Autoscale overview in Azure*
- *Use custom images for Azure virtual machine scale sets*

---

## Question 43: High-Availability Connectivity: Traffic Manager (Multi-Region Web) & Standard Load Balancer (Availability Zones Always On)
- **Domain:** Design Infrastructure Solutions
- **Type:** Drag and Drop / Matching

#### Question:
You have an Azure web app in two regions and a SQL Server Always On availability group that spans two availability zones.

You need to design a high-availability and resilient connectivity strategy that protects the web app and the availability group. The solution must minimize costs.

What should you do? To answer, drag the appropriate networking component to each requirement. A networking component may be used once, more than once, or not at all.

#### Options Available:
- `Azure Application Gateway`
- `Azure Traffic Manager`
- `Standard Load Balancer`
- `A Gateway Load Balancer`

#### Correct Matches:
- **Azure web app:** **`Azure Traffic Manager`**
  - *Explanation:* Azure Traffic Manager uses DNS-based routing across endpoints in two different regions to provide automated global failover and disaster recovery at minimal cost.
- **SQL Server Always On availability group:** **`Standard Load Balancer`**
  - *Explanation:* An internal Standard Load Balancer provides the zone-redundant floating IP (Direct Server Return) listener required by Windows Server Failover Clustering (WSFC) and Always On Availability Groups across availability zones.

📚 **References:**
- *Configure an internal load balancer for an Always On availability group in Azure*
- *Azure Traffic Manager overview*
- *What is Azure Standard Load Balancer?*

---

## Question 44: Offline Data Migration: Azure Data Box (65 TB File Server to Cool Tier)
- **Domain:** Design Infrastructure Solutions
- **Type:** Multiple Choice

#### Question:
Your company is in the process of migrating its data operations from an on-premises network to Azure storage. The company has over 65 terabytes of files currently stored in on-premises file servers and it wants to import this data into an Azure cool storage tier.

You need to recommend a solution for transferring the data. The solution must minimize costs and interruptions to the on-premises network.

Which solution should you recommend?

#### Options:
- [ ] Azure Data Factory
- [ ] AzCopy
- [x] Azure Data Box
- [ ] Data Migration Assistant

#### Correct Answer:
- **`Azure Data Box`**

💡 **Explanation:**
You should recommend **Azure Data Box**. Transferring 65 TB of data over an active corporate internet connection via online tools (like AzCopy or Azure Data Factory) would saturate WAN links, severely interrupt day-to-day operations, and take weeks to complete. Azure Data Box provides physical appliances (e.g. Data Box 120 with 120 TB capacity) shipped to your office. You load data locally over 10 GbE interfaces at gigabyte speeds, ship the device back to Microsoft, and Microsoft uploads the data directly into your Azure Cool Blob storage account.

❌ **Why the other options are incorrect:**
- **AzCopy:** A CLI tool that transfers data over the network, causing heavy WAN contention and interruptions for 65 TB of data.
- **Azure Data Factory:** A cloud ETL pipeline that requires active network bandwidth to ingest data into Azure.
- **Data Migration Assistant:** Specifically for assessing and migrating SQL Server relational databases, not unstructured file server shares.

📚 **References:**
- *What is Azure Data Box?*
- *Choose an Azure solution for data transfer*
- *Data Box pricing and capacity*

---

## Question 45: Configuration Management: Azure App Configuration Geo-Replication (Throttling Relief & Resiliency)
- **Domain:** Design Infrastructure Solutions
- **Type:** Multiple Choice

#### Question:
Your company runs a globally distributed application that reads its settings from Azure App Configuration. Under peak load the application is being throttled by the configuration store, and it must keep reading settings if one region becomes unavailable without operational overhead.

You need to recommend a solution.

What should you recommend?

#### Options:
- [ ] A manual per-region configuration
- [ ] The Kubernetes configuration provider
- [x] Geo-replication across multiple regions
- [ ] A single-region configuration instance

#### Correct Answer:
- **`Geo-replication across multiple regions`**

💡 **Explanation:**
You should recommend **geo-replication across multiple regions**. Azure App Configuration Premium tier supports geo-replication, which creates replica configuration stores across target regions. Each replica provides independent request quotas (multiplying your overall throughput to completely eliminate throttling under peak traffic) and automatically synchronizes key-values. Clients configured with the App Configuration SDK automatically fail over to an available replica if the primary region goes down, requiring zero manual configuration sync or operational overhead.

❌ **Why the other options are incorrect:**
- **A single-region configuration instance:** Fails multi-region disaster recovery and cannot resolve request throttling.
- **A manual per-region configuration:** Manually maintaining separate stores across regions causes configuration drift, deployment overhead, and lacks automated SDK failover.
- **The Kubernetes configuration provider:** Pulls configuration into a Kubernetes cluster, but does not solve cloud request throttling quotas or multi-region replication.

📚 **References:**
- *Geo-replication in Azure App Configuration*
- *Azure App Configuration resiliency and disaster recovery*
- *App Configuration request limits and throttling*

---

## Question 46: Edge Caching & Streaming: Azure Content Delivery Network (CDN) for High-Bandwidth Video/Audio
- **Domain:** Design Infrastructure Solutions
- **Type:** Multiple Choice

#### Question:
Your company deploys a web app that streams audio and video content to users. Users require a high-bandwidth connection to the content to ensure continuous streaming. You want to set up data stores in the geographic locations nearest to high concentrations of users, which are in various Azure zones.

The data is stored in a General-purpose v2 storage account configured for zone-redundant storage (ZRS).

You need to recommend a solution to help to support continuous streaming in select locations.

What should you recommend?

#### Options:
- [ ] Azure Cache for Redis
- [x] Azure Content Delivery Network (CDN)
- [ ] Geo-zone-redundant storage (GZRS)
- [ ] Azure Web Application Firewall

#### Correct Answer:
- **`Azure Content Delivery Network (CDN)`**

💡 **Explanation:**
You should recommend **Azure Content Delivery Network (CDN)**. Azure CDN caches large static audio/video media files at globally distributed edge Point-of-Presence (POP) locations closest to high concentrations of end users. This delivers high sustained throughput, minimizes streaming latency, and drastically reduces bandwidth egress loads on the origin storage account.

❌ **Why the other options are incorrect:**
- **Azure Cache for Redis:** An in-memory data store for caching database queries and session state, not for distributing multi-megabyte/gigabyte media streaming files.
- **Geo-zone-redundant storage (GZRS):** Replicates storage across availability zones and secondary regions for disaster recovery, but does not provide edge caching near users.
- **Azure Web Application Firewall:** A Layer 7 security service that filters out malicious web attacks; it does not provide content caching or media delivery bandwidth optimization.

📚 **References:**
- *What is a content delivery network on Azure?*
- *Optimize Azure CDN for media streaming*
- *Azure Storage integration with Azure CDN*

---

## Question 47: Serverless & Batch Processing: Azure Batch & Azure Container Apps Jobs (Scale-to-Zero Nightly Parallel Jobs)
- **Domain:** Design Infrastructure Solutions
- **Type:** Multiple Choice (Select Two)

#### Question:
Your company must run a nightly batch job that processes millions of independent transaction records in parallel and then scales down to zero when the job finishes. The team must not maintain a cluster for this workload. You need to recommend compute services.

Which services can each meet the requirement on their own?

Each correct answer presents a complete solution.

#### Options:
- [x] Azure Batch
- [ ] Virtual machine scale sets
- [ ] Azure Kubernetes Service
- [ ] Azure App Service
- [x] Azure Container Apps jobs

#### Correct Answers:
- **`Azure Batch`**
- **`Azure Container Apps jobs`**

💡 **Explanation:**
You should recommend **Azure Batch** and **Azure Container Apps jobs**:
1. **Azure Batch:** Purpose-built for large-scale parallel and high-performance computing batch processing. It spins up VM compute nodes on demand, runs tasks in parallel across millions of records, and scales down to zero nodes when complete, with zero cluster maintenance fees.
2. **Azure Container Apps Jobs:** Specifically designed for triggered, finite containerized tasks that run in parallel to completion and automatically scale down to zero, eliminating all underlying Kubernetes cluster management overhead.

❌ **Why the other options are incorrect:**
- **Azure Kubernetes Service (AKS):** Requires active cluster maintenance and control plane management, violating the constraint: *"The team must not maintain a cluster for this workload."*
- **Virtual machine scale sets:** Requires managing VM OS images and underlying infrastructure configurations, and lacks a native serverless scale-to-zero job execution engine.
- **Azure App Service:** Built for long-running web applications and APIs, not for finite large-scale parallel batch jobs that scale to zero.

📚 **References:**
- *Jobs in Azure Container Apps*
- *What is Azure Batch?*
- *Run batch workloads on Azure Container Apps*


---

## Question 48: Microservices Autoscaling: Azure Kubernetes Service (AKS) vs VMs with Docker vs ACI
- **Domain:** Design Infrastructure Solutions
- **Type:** Yes/No Statements

#### Question:
You manage a complex inventory management clearinghouse application named App1 that is deployed to Azure. When a new client joins clearinghouse, a new data connector must be added to App1. You note that App1 experiences measurable performance degradation as more connectors are being added.

You need to design a solution that allows new data connectors to be brought online without App1 experiencing any performance degradation.

App1 and data connectors for each client is developed as a microservice.

What should you do? For each of the following statements, select Yes if the statement is true. Otherwise, select No.

#### Statements & Answers:
- **Use Azure Kubernetes Service (AKS) to automatically scale your App1:** **`Yes`**
  - *Explanation:* AKS provides enterprise-grade container orchestration and Horizontal Pod Autoscaling (HPA) that dynamically scales pods based on CPU, memory, or custom metrics, allowing App1 and data connectors to scale automatically as new clients join.
- **Use VMs to deploy additional Docker containers:** **`No`**
  - *Explanation:* Running standalone Docker containers on unmanaged VMs lacks automated service discovery, cluster-wide load balancing, and coordinated autoscaling, requiring excessive operational management.
- **Use Azure Container Instances (ACI) to orchestrate scaling for App1:** **`No`**
  - *Explanation:* Azure Container Instances (ACI) is a lightweight serverless container hosting service for isolated, short-lived tasks, but it lacks an orchestration control plane, ingress controllers, and robust inter-service autoscaling required for complex microservice architectures.

📚 **References:**
- *Autoscaling in Azure Kubernetes Service (AKS)*
- *Determine when to use Azure Container Instances versus Azure Kubernetes Service*
- *Microservices architecture on Azure Kubernetes Service (AKS)*

---

## Question 49: Azure Migrate Suite: Workload Support Matrix & Discovery vs Migration Tools
- **Domain:** Design Infrastructure Solutions
- **Type:** Yes/No Statements

#### Question:
Your company has an on-premises Active Directory domain that supports a variety of resources, including:
- SQL Server database
- Non-relational data stores
- Web apps
- Hyper-V virtual machines (VMs)
- Physical servers

Your company wants to use the tools included in the Azure Migrate service to migrate resources to Azure.

You need to determine which migrations are supported through Azure Migrate tools.

For each of the following statements, select Yes if the statement is true. Otherwise, select No.

#### Statements & Answers:
- **You can migrate on-premises Hyper-V VMs, physical servers, and public cloud VMs to Azure VMs:** **`Yes`**
  - *Explanation:* Azure Migrate: Server Migration tool natively supports agentless and agent-based migration of Hyper-V VMs, physical bare-metal servers, and AWS/GCP VMs to Azure VMs.
- **You can migrate non-relational data stores to Azure by using the Azure Migrate: Discovery and assessment tool:** **`No`**
  - *Explanation:* The 'Discovery and assessment' tool only assesses readiness, sizing, and cost estimation; it does not execute migrations. Furthermore, actual migration of non-relational databases (such as MongoDB) is performed using Azure Database Migration Service (DMS) targeting Azure Cosmos DB, not the discovery tool.
- **You can migrate web apps to Azure:** **`Yes`**
  - *Explanation:* Azure Migrate includes the Azure App Service Migration Assistant, which assesses and automates the migration of on-premises ASP.NET (IIS) and Java web applications directly to Azure App Service.

📚 **References:**
- *About Azure Migrate*
- *Azure Migrate: Server Migration overview*
- *Migrate web apps to Azure App Service*

---

## Question 50: Solution Evaluation - Real-Time IoT Ingestion & Bi-Directional Device Control
- **Domain:** Design Infrastructure Solutions
- **Type:** Case Study / Solution Evaluation Series

#### 📋 Scenario:
A manufacturing company is looking to improve its manufacturing processes. IoT sensors throughout the production line collect real-time data. The company wants to perform real-time data collection and analysis from these devices. The solution must support bi-directional communication to send commands back to the IoT sensors.

You need to develop a data flow process to meet this requirement.

*(Note: This case study contains a series of questions that present the same scenario. Each question in the series contains a unique solution that might meet the stated goals. You cannot go back or review questions of this type on the actual certification exam.)*

---

### Part 1:
- **Proposed Solution:** You configure the IoT sensors with an event hub and send the data to Azure Stream Analytics for analysis.
- **Question:** Does this solution meet the goal?
- **Answer:** **`No`**
- 💡 **Explanation:** This solution does NOT meet the goal. While Azure Event Hubs can stream data into Azure Stream Analytics, Event Hubs only supports unidirectional ingestion (device-to-cloud). It does NOT support bi-directional communication or Cloud-to-Device (C2D) messaging to send commands back to the IoT sensors.

---

### Part 2:
- **Proposed Solution:** You configure an IoT hub to receive the data and send the data to Azure Data Factory.
- **Question:** Does this solution meet the goal?
- **Answer:** **`No`**
- 💡 **Explanation:** This solution does NOT meet the goal. While Azure IoT Hub supports bi-directional communication, Azure Data Factory (ADF) is a batch extract-transform-load (ETL) service designed for scheduled, high-volume batch data movement, not for real-time sub-second stream analytics.

---

### Part 3:
- **Proposed Solution:** You configure an IoT hub to receive the data and send the data to Azure Stream Analytics.
- **Question:** Does this solution meet the goal?
- **Answer:** **`Yes`**
- 💡 **Explanation:** This solution MEETS all requirements:
  1. **Bi-Directional IoT Communication:** Azure IoT Hub natively supports secure bi-directional communication, including cloud-to-device (C2D) commands and device twins to control production line sensors.
  2. **Real-Time Telemetry Analysis:** Azure Stream Analytics processes fast-moving streaming data from IoT Hub in real-time with sub-second latency.

📚 **References:**
- *Compare Azure IoT Hub to Azure Event Hubs*
- *Stream data as input into Stream Analytics*
- *Cloud-to-device communications guidance (IoT Hub)*


---

## Question 51: Cloud Adoption Framework (CAF): The Plan Methodology (Digital Estate & TCO Business Case)
- **Domain:** Design Infrastructure Solutions
- **Type:** Multiple Choice

#### Question:
Your company is planning a cloud migration and has produced a digital estate inventory together with a business case that includes the total cost of ownership.

You need to identify the Cloud Adoption Framework methodology that produces these deliverables.

Which methodology should you recommend?

#### Options:
- [ ] The Govern methodology
- [ ] The Ready methodology
- [x] The Plan methodology
- [ ] The Strategy methodology

#### Correct Answer:
- **`The Plan methodology`**

💡 **Explanation:**
You should recommend the **Plan methodology**. Within the Microsoft Cloud Adoption Framework (CAF), the Plan methodology rationalizes the digital estate (inventory, workload rationalization) and develops the business case including Total Cost of Ownership (TCO) and organizational cloud adoption plans.

❌ **Why the other options are incorrect:**
- **The Strategy methodology:** Defines high-level business motivations, outcomes, and financial justification, but does not inventory the digital estate or produce the granular technical TCO model.
- **The Ready methodology:** Prepares the cloud environment by creating Azure Landing Zones post-planning.
- **The Govern methodology:** Establishes ongoing corporate policies, compliance guardrails, and cost management after workloads are deployed.

📚 **References:**
- *Cloud Adoption Framework - Plan methodology*
- *Rationalize digital estate in Cloud Adoption Framework*
- *Cloud Adoption Framework overview*

---

## Question 52: Relational Database Migration: Azure SQL Database Elastic Pool (Non-Coinciding Peak Usage)
- **Domain:** Design Infrastructure Solutions
- **Type:** Multiple Choice

#### Question:
Your company runs four on-premises SQL Server instances, each hosting one database. You want to move the databases to Azure. Each database has a different usage profile and its peak periods do not coincide with the others. The solution must keep cost and maintenance to a minimum, and the company does not require surface area compatibility with the on-premises instances.

You need to recommend a target for the four databases.

What should you recommend?

#### Options:
- [ ] Azure SQL Managed Instance
- [x] An elastic pool in Azure SQL Database
- [ ] SQL Server on Azure Virtual Machines
- [ ] A single database in Azure SQL Database

#### Correct Answer:
- **`An elastic pool in Azure SQL Database`**

💡 **Explanation:**
You should recommend **an elastic pool in Azure SQL Database**. Azure SQL Database elastic pools allow multiple databases with unpredictable and non-coinciding peak usage patterns to share a collective pool of compute resources (eDTUs or vCores). Rather than over-provisioning each database individually for its peak load, the databases draw from the shared pool on demand, minimizing cost while delivering a fully managed PaaS service with near-zero administrative overhead.

❌ **Why the other options are incorrect:**
- **Azure SQL Managed Instance:** Designed for near 100% surface-area compatibility (e.g., cross-database queries, CLR, SQL Agent), but significantly more expensive and unnecessary when surface-area compatibility is not required.
- **SQL Server on Azure Virtual Machines:** IaaS deployment incurring high operating system maintenance, licensing, and administration costs.
- **A single database in Azure SQL Database:** Sizing each database separately for peak capacity wastes resources during idle hours.

📚 **References:**
- *Elastic pools help you manage and scale multiple databases in Azure SQL Database*
- *Azure SQL Database purchasing models*
- *Choose an Azure SQL deployment option*

---

## Question 53: Pre-Migration Assessment: Azure Migrate Dependency Analysis & Code Assessment
- **Domain:** Design Infrastructure Solutions
- **Type:** Multiple Choice (Select Two)

#### Question:
You must assess a large estate of on-premises servers before migrating them to Azure. You need to discover the servers and their performance without installing agents, group interdependent servers, and evaluate the readiness of the Java and .NET application code.

You need to recommend the tools.

What should you recommend? Each correct answer presents part of the solution.

#### Options:
- [ ] Azure Advisor recommendations
- [ ] Azure Monitor metrics
- [x] Azure Migrate dependency analysis
- [ ] Azure Resource Mover
- [x] Azure Migrate code assessment

#### Correct Answers:
- **`Azure Migrate dependency analysis`**
- **`Azure Migrate code assessment`**

💡 **Explanation:**
You should recommend **Azure Migrate dependency analysis** and **Azure Migrate code assessment**:
1. **Azure Migrate dependency analysis:** Discovers network communication between on-premises servers and groups interdependent tiers together (via agentless discovery or lightweight agents) so multi-tier application workloads can be migrated without breaking dependencies.
2. **Azure Migrate code assessment:** Scans Java and .NET application source code and binaries to identify compatibility issues, deprecated libraries, and required code changes prior to cloud migration.

❌ **Why the other options are incorrect:**
- **Azure Advisor recommendations:** Provides optimization advice for workloads already running inside Azure, not for discovering on-premises server estates.
- **Azure Monitor metrics:** Tracks telemetry of running Azure resources, not on-premises dependency mapping or pre-migration code assessment.
- **Azure Resource Mover:** Used to move deployed Azure resources between different Azure regions.

📚 **References:**
- *Dependency analysis in Azure Migrate*
- *Azure Migrate application and code assessment*
- *Assess servers for migration with Azure Migrate*

---

## Question 54: Automated Server Migration: Azure Migrate for Hyper-V Cluster (Zero-Downtime Replication)
- **Domain:** Design Infrastructure Solutions
- **Type:** Multiple Choice

#### Question:
Your company has an on-premises Active Directory and is gradually migrating on-premises resources to its Azure subscription. The on-premises domain has a Hyper-V cluster that hosts 20 VMs that run a mix of Windows Server 2016 and Ubuntu Linux, supporting various workloads.

The company plans to migrate the VMs to Azure. The VMs must remain available while their disks are migrated.

You need to recommend a solution to migrate the on-premises machines to Azure. You should minimize the effort required.

What should you use?

#### Options:
- [x] Azure Migrate
- [ ] AzCopy command
- [ ] Copy Data tool
- [ ] Azure Database Migration Service

#### Correct Answer:
- **`Azure Migrate`**

💡 **Explanation:**
You should use **Azure Migrate** (Server Migration). Azure Migrate provides agentless replication for Hyper-V environments. It performs initial baseline replication of the VM disks to Azure managed disks while production VMs stay online and operational, followed by continuous delta synchronization. When ready, it coordinates automated cutover with near-zero downtime and minimal manual administrative effort.

❌ **Why the other options are incorrect:**
- **AzCopy command:** A command-line file copy utility; cannot capture or delta-replicate running VM disks.
- **Copy Data tool:** An Azure Data Factory feature designed for moving data files and database tables, not server operating systems.
- **Azure Database Migration Service:** Designed for relational/non-relational database migrations, not full Hyper-V virtual machine migrations.

📚 **References:**
- *Migrate Hyper-V VMs to Azure with Azure Migrate Server Migration*
- *About agentless Hyper-V migration in Azure Migrate*
- *Azure Migrate overview*

---

## Question 55: Hybrid Data Access: On-Premises Data Gateway for Logic Apps (Zero Inbound Firewall Openings)
- **Domain:** Design Infrastructure Solutions
- **Type:** Multiple Choice (Select Two)

#### Question:
Your company runs a human resources workflow in an Azure Logic App named LApp1. LApp1 must query employee data from a SQL Server database named DB1 that runs in the on-premises datacenter.

DB1 must not be reachable from the internet, and the perimeter firewall must not accept any inbound connections.

You need to recommend a design that allows LApp1 to query DB1.

Which two components should you recommend? Each correct answer presents part of the solution.

#### Options:
- [x] An on-premises data gateway resource in the Azure subscription
- [ ] An application registration in Microsoft Entra ID
- [x] An on-premises data gateway installed on a server in the datacenter
- [ ] Microsoft Entra application proxy
- [ ] A site-to-site VPN connection to the on-premises network

#### Correct Answers:
- **`An on-premises data gateway resource in the Azure subscription`**
- **`An on-premises data gateway installed on a server in the datacenter`**

💡 **Explanation:**
You should recommend installing an **On-Premises Data Gateway on a server in the datacenter** and creating an **On-Premises Data Gateway resource in your Azure subscription**:
1. **On-Premises Data Gateway Software:** Installed on a local Windows Server inside the datacenter. It establishes an outbound-only connection to Azure Service Bus Relay, completely eliminating the need to open inbound firewall ports on the perimeter firewall.
2. **Azure Gateway Resource:** Associated with the local gateway installation, allowing cloud services (like Azure Logic Apps and Power BI) to securely query on-premises SQL Server DB1 through the managed connector.

❌ **Why the other options are incorrect:**
- **An application registration in Microsoft Entra ID:** Manages token authentication, but provides no network transport or line-of-sight to on-premises database servers.
- **Microsoft Entra application proxy:** Publishes internal web-based HTTP applications for remote users, not internal SQL database protocols for Logic Apps.
- **A site-to-site VPN connection to the on-premises network:** Logic Apps managed SQL connectors communicate with on-premises SQL Server natively through the On-Premises Data Gateway, which avoids complex VPN routing and perimeter firewall configuration.

📚 **References:**
- *Connect to on-premises data sources from Azure Logic Apps*
- *What is an on-premises data gateway?*
- *Install an on-premises data gateway for Azure Logic Apps*

---

## Question 56: Event-Driven Auditing & IaC: Azure Event Grid & Azure Bicep
- **Domain:** Design Infrastructure Solutions
- **Type:** Multiple Choice (Select Two)

#### Question:
You are designing an auditing application developed as multiple Azure functions that will:
- Subscribe to events from other resources across an Azure subscription, like storage account key rotation and virtual machine creation.
- Receive events from the resources as soon as they happen.
- Deploy all resources related to the application using Infrastructure as Code (IaC).

You need to determine which Azure features or services are necessary to create the solution.

Which two Azure features or services should you recommend? Each correct answer presents part of the solution.

#### Options:
- [ ] Azure Queue Storage
- [x] Azure Bicep
- [ ] Azure Automation
- [ ] Azure Service Bus
- [x] Azure Event Grid

#### Correct Answers:
- **`Azure Bicep`**
- **`Azure Event Grid`**

💡 **Explanation:**
You should recommend **Azure Event Grid** and **Azure Bicep**:
1. **Azure Event Grid:** A fully managed publish-subscribe event routing service built natively into Azure. Azure resources (like storage accounts, VMs, and subscriptions) emit native events that Event Grid pushes directly to subscriber endpoints (like Azure Functions) in real-time.
2. **Azure Bicep:** Microsoft's declarative domain-specific language for Infrastructure as Code (IaC) that simplifies authoring ARM templates to provision Azure Functions, event subscriptions, and related resources consistently.

❌ **Why the other options are incorrect:**
- **Azure Queue Storage / Service Bus:** Enterprise messaging queues where consumers poll for messages to process transactions, rather than reactive real-time pub/sub event routers for Azure resource management events.
- **Azure Automation:** Runs administrative PowerShell runbooks, but is not a declarative Infrastructure as Code deployment tool like Bicep.

📚 **References:**
- *What is Azure Event Grid?*
- *Azure Event Grid event schema for Azure subscription events*
- *What is Bicep?*


---

## Question 57: Workflow Redesign: Azure Logic Apps (Graphical Workflow Replacement for Windows Workflow Foundation)
- **Domain:** Design Infrastructure Solutions
- **Type:** Multiple Choice

#### Question:
Your company has a Windows Workflow Foundation (WF) application that processes incoming invoices. The developers want to redesign the application so that they can use an Azure cloud service without losing the ability to design workflows graphically.

You need to recommend an Azure resource that meets the above requirements.

Which resource should you recommend?

#### Options:
- [ ] WebJob
- [ ] Container Instance
- [x] Logic app
- [ ] Functions app

#### Correct Answer:
- **`Logic app`**

💡 **Explanation:**
You should recommend a **Logic app**. Azure Logic Apps is a serverless Platform-as-a-Service (PaaS) orchestration engine that provides a visual, graphical designer (Logic Apps Designer). It is Microsoft's direct cloud evolution and replacement pattern for Windows Workflow Foundation (WF) and BizTalk Server, allowing complex business workflows to be modeled graphically with hundreds of pre-built connectors.

❌ **Why the other options are incorrect:**
- **WebJob:** Background tasks running within an App Service plan that lack a graphical workflow designer.
- **Container Instance:** Runs container images; provides no graphical workflow orchestration engine.
- **Functions app:** A code-first execution environment (C#, Python, JavaScript) without a graphical workflow designer.

📚 **References:**
- *What is Azure Logic Apps?*
- *Choose between Azure Functions and Azure Logic Apps*
- *Migrate from Windows Workflow Foundation to Azure Logic Apps*

---

## Question 58: Compute Sizing: Fsv2-Series Virtual Machines for Compute-Intensive Batch Workloads
- **Domain:** Design Infrastructure Solutions
- **Type:** Multiple Choice

#### Question:
You manage an Azure subscription at a technology company. You need to recommend a VM that hosts a batch processing application.

The application must analyze a very compute-intensive workload. The workload has consistent medium-to-high CPU utilization. Cost is not a major consideration.

Which VM series should you choose?

#### Options:
- [ ] Ev3-Series
- [x] Fsv2-Series
- [ ] B-Series
- [ ] Dv3-Series

#### Correct Answer:
- **`Fsv2-Series`**

💡 **Explanation:**
You should choose the **Fsv2-Series** VM. The Fsv2-series is Azure's compute-optimized virtual machine family. It features a high CPU-to-memory ratio (2 GiB of RAM per vCPU) powered by fast 3.4 GHz Intel Xeon Platinum processors (boosting to 3.7 GHz). It is specifically engineered for compute-intensive batch processing, mathematical modeling, analytics, and gaming servers with sustained high CPU utilization.

❌ **Why the other options are incorrect:**
- **Ev3-Series:** Memory-optimized (large RAM to vCPU ratio) for databases and in-memory caches, not compute-bound workloads.
- **B-Series:** Provides burstable performance using accumulated CPU credits and is unsuited for workloads with sustained medium-to-high CPU usage.
- **Dv3-Series:** A general-purpose VM series with a balanced 1:4 vCPU-to-memory ratio, not maximized for heavy compute-bound processing.

📚 **References:**
- *Fsv2-series virtual machine sizes*
- *Sizes for virtual machines in Azure*
- *Compute optimized virtual machine sizes*

---

## Question 59: Load Balancing Capabilities: Application Gateway URL Routing & Front Door Global CDN
- **Domain:** Design Infrastructure Solutions
- **Type:** Yes/No Statements

#### Question:
Your company has deployed multiple cloud-based websites and apps using Azure services. You have been asked to recommend methods that can be used to optimize network performance and you have elected to deploy several Azure load-balancing solutions. Specifically, you have implemented the following configuration:
- An e-commerce website has been deployed using Azure Application Gateway.
- A business intelligence app has been deployed using Azure Front Door.

For each of the following statements, select Yes if the statement is true. Otherwise, select No.

#### Statements & Answers:
- **If an incoming request to the e-commerce website includes "/photos" in the URL, you can route to a pool that has been optimized for storing images:** **`Yes`**
  - *Explanation:* Azure Application Gateway operates at Layer 7 and natively supports path-based URL routing, allowing requests with `/photos/*` in the URI path to be directed to a dedicated backend pool optimized for image processing or static storage.
- **If requests are sent to the website or the app using resolvable hostnames, you can use DNS to route traffic to servers based on rules you define:** **`No`**
  - *Explanation:* Application Gateway and Azure Front Door evaluate incoming Layer 7 HTTP requests (headers, paths, cookies). DNS-based traffic routing rules are configured using Azure Traffic Manager, not Application Gateway or Front Door directly.
- **If requests for the business intelligence app come from users in remote parts of the world, you can service those requests using a content delivery network (CDN):** **`Yes`**
  - *Explanation:* Azure Front Door includes built-in global Content Delivery Network (CDN) edge caching capabilities, serving static content from hundreds of Microsoft Global Edge Point-of-Presence (POP) locations closest to global users.

📚 **References:**
- *URL path-based routing overview with Azure Application Gateway*
- *Azure Front Door features and edge caching*
- *Comparing load-balancing options in Azure*

---

## Question 60: Web Performance Optimization: Azure Cache for Redis & Azure Front Door
- **Domain:** Design Infrastructure Solutions
- **Type:** Drag and Drop / Matching

#### Question:
Your company has deployed a web app through Azure App Service. The application worked well during initial testing, but performance problems became evident after it was placed under a production load. The app relies heavily on a backend data store both for running the application and for delivering content to users. You enabled the Always On feature to help ensure availability and to improve response times.

Two specific requirements have been identified:
- Content needs to be available closer to the web app instance with minimal latency.
- Downloadable content needs to be local to, or at least closer to, application users.

You need to recommend solutions to meet each of these requirements.

To answer, drag the appropriate solution to each requirement. A solution may be used once, more than once, or not at all.

#### Options Available:
- `Azure Application Firewall`
- `Azure Cache for Redis`
- `Azure Front Door`
- `Azure Service Fabric`
- `Azure Traffic Manager`

#### Correct Matches:
- **To hold backend content local to the web app:** **`Azure Cache for Redis`**
  - *Explanation:* Azure Cache for Redis keeps frequently accessed backend data and session state in-memory directly within the same Azure datacenter/region as App Service, reducing backend database query latency to sub-milliseconds.
- **To deliver content from a closer location to web users:** **`Azure Front Door`**
  - *Explanation:* Azure Front Door acts as a modern global CDN, caching downloadable static content at Microsoft edge POPs geographically adjacent to distributed users worldwide.

📚 **References:**
- *About Azure Cache for Redis*
- *Azure Front Door overview*
- *Caching patterns in Azure architecture*

---

## Question 61: Intra-Subnet Microsegmentation: Network Security Groups (NSGs) & Application Security Groups (ASGs)
- **Domain:** Design Infrastructure Solutions
- **Type:** Multiple Choice (Select Two)

#### Question:
You manage a virtual network named vnet1 that contains a subnet named subnet1.

You deploy 30 Azure Virtual Machines (VMs) in subnet1. Five of these Azure VMs are used for a distributed database, 20 VMs are used by a batch application, and the other VMs host a web application. The private IP address for all Azure VMs changes frequently.

The distributed database VMs should be accessed by the batch application VMs only.

You need to restrict network access in subnet1.

Which two services or features should you use? Each correct answer presents part of the solution.

#### Options:
- [ ] Azure Firewall
- [ ] Network rule
- [ ] Service tags
- [x] Network security groups (NSGs)
- [x] Application security groups (ASGs)

#### Correct Answers:
- **`Network security groups (NSGs)`**
- **`Application security groups (ASGs)`**

💡 **Explanation:**
You should use **Network Security Groups (NSGs)** and **Application Security Groups (ASGs)**:
1. **Application Security Groups (ASGs):** Allow you to group network interfaces (NICs) logically by workload role (`ASG-Database` and `ASG-Batch`) regardless of their dynamically assigned private IP addresses. Because private IPs change frequently, defining rules based on ASGs removes the need to track dynamic IP changes.
2. **Network Security Groups (NSGs):** You associate an NSG to subnet1 with inbound security rules specifying the Source as `ASG-Batch` and Destination as `ASG-Database` (Allow), while denying traffic from other workloads in the subnet.

❌ **Why the other options are incorrect:**
- **Azure Firewall:** Does not natively filter east-west traffic between VMs inside the same flat subnet without complex routing hairpinning via UDRs.
- **Network rule:** A component of Azure Firewall policies, not the native intra-subnet security mechanism.
- **Service tags:** Represent platform services (like AzureStorage or Sql), not custom groups of VMs in a subnet.

📚 **References:**
- *Application security groups overview*
- *Network security groups overview*
- *Filter network traffic with network security groups*

---

## Question 62: Online Database Migration: Azure Database Migration Service (PostgreSQL, MySQL, Cosmos DB for MongoDB)
- **Domain:** Design Infrastructure Solutions
- **Type:** Drag and Drop / Matching

#### Question:
Your company wants to migrate three databases to Azure with Azure Database Migration Service. Each migration must be an online migration, because the applications cannot be stopped.

- Database1 is a PostgreSQL database on an on-premises Linux server.
- Database2 is a MySQL database on an on-premises Linux server.
- Database3 is a MongoDB database on an on-premises Linux server.

You need to recommend a target service for each database.

Which target should you recommend? To answer, drag the appropriate target to each database. A target may be used once, more than once, or not at all.

#### Options Available:
- `SQL Server on Azure VM`
- `Cosmos DB for MongoDB`
- `Azure SQL Database`
- `Azure Database for MySQL`
- `Azure Database for PostgreSQL`

#### Correct Matches:
- **Database 1:** **`Azure Database for PostgreSQL`**
  - *Explanation:* Database1 is an on-premises PostgreSQL engine; Azure Database Migration Service (DMS) supports continuous online data replication directly to Azure Database for PostgreSQL Flexible Server.
- **Database 2:** **`Azure Database for MySQL`**
  - *Explanation:* Database2 is an on-premises MySQL engine; DMS replicates MySQL binary logs (binlog) continuously to Azure Database for MySQL Flexible Server for zero-downtime cutover.
- **Database 3:** **`Cosmos DB for MongoDB`**
  - *Explanation:* Database3 is an on-premises MongoDB document database; DMS supports online migration using MongoDB oplog tailing into Azure Cosmos DB API for MongoDB.

📚 **References:**
- *What is Azure Database Migration Service?*
- *Migrate PostgreSQL to Azure Database for PostgreSQL online using DMS*
- *Migrate MySQL to Azure Database for MySQL online using DMS*
- *Migrate MongoDB to Azure Cosmos DB online using DMS*


---

## Question 63: Case Study: CompanyA - Global Online Retail Cloud Modernization
- **Domain:** Design Infrastructure Solutions
- **Type:** Case Study (Multi-Tab Specification with 5 Questions)
- **Case Study ID:** `cs-companya-retail-modernization`

---

### 📑 Case Study Sections:

#### 1. Overview
You work for CompanyA, a large-scale online retail store company which sells electronic products. The company has operations in the North America and Europe regions.

#### 2. On-premises Environment
The company hosts the application from two data centers located in New York and London. The data centers are connected using high-speed VPN connections. The application is a monolith application deployed on multiple virtual machines hosted on Hyper-V. SQL Database is used to store the application's data. The product asset files, like images and videos, are stored in Network Attached Storage (NAS) file shares.

#### 3. Planned Changes
CompanyA wants to modernize applications and data to deliver an improved experience to users. It has decided to use Azure as a cloud service provider and build cloud-native applications. The core platform features of the online store will be built as microservices that will be published as APIs for consumption. A fully-managed relational database will be used by the APIs to store the state. Azure storage accounts will be used for the product assets, along with other documents that will be generated by invoice and billing APIs for purchases.

#### 4. Resiliency Requirements
- The APIs should run in an active-active environment from multiple Azure regions.
- The compute infrastructure hosting the APIs must be spread across the availability zone.
- User requests to the APIs should automatically failover in cases of outages.
- The database must have geo-replication enabled.

#### 5. Business Requirements
- Administrative effort must be minimized to maintain the solution.
- Cost should be minimized.
- Developers should be able to easily add or remove new microservices to the solution with least effort.

#### 6. Network Requirements
- The API endpoints should be available from a single domain using path-based routing.
- Requests to the APIs should be sent to the region with the lowest latency.
- The database must be available privately for the APIs.

#### 7. Security Requirements
- The APIs must be available only on the HTTPS protocol.
- Access to Azure services from APIs must be provided securely.

---

### ❓ Case Study Questions:

#### Question 1: Compute Platform for APIs
**Question:** Which compute solution should you recommend for the APIs? The solution must meet the resiliency requirements.

- [ ] Azure Container Instance (ACI)
- [ ] Azure App Service
- [ ] Azure Functions
- [x] Azure Kubernetes Service (AKS)

**Correct Answer:** **`Azure Kubernetes Service (AKS)`**  
💡 **Explanation:** Azure Kubernetes Service (AKS) satisfies all requirements:
1. **Zonal & Multi-Region Resiliency:** AKS supports availability-zone-aware node pools within each region and can be deployed active-active across multiple regions behind Azure Front Door.
2. **Microservices Scalability & In-Cluster Discovery:** Adding or removing new microservices requires no new infrastructure or per-service ARM templates; Kubernetes handles internal service discovery, load balancing, and scaling automatically.
3. **Cost-Efficiency:** The AKS managed control plane is free; you only pay for the VM worker nodes.

---

#### Question 2: Secure Database Connectivity
**Question:** You need to recommend a solution for the microservices to connect to the Azure SQL database. The traffic should always remain private and must be secure. What should you do?

- [ ] Use service endpoints.
- [ ] Define network access controls.
- [x] Use Azure Private Link.
- [ ] Define outbound firewall rules.

**Correct Answer:** **`Use Azure Private Link.`**  
💡 **Explanation:** Azure Private Link creates a **Private Endpoint** with a private IP address inside your virtual network for Azure SQL Database. All query traffic travels strictly over the private Microsoft backbone network and never traverses or exposes endpoints to the public internet.

---

#### Question 3: Traffic Routing Architecture
**Question:** Which two networking solutions should you recommend for traffic routing? Each correct answer presents part of the solution.

- [x] Azure Front Door
- [ ] Azure Load Balancer
- [ ] Azure Traffic Manager
- [x] Azure Application Gateway

**Correct Answers:**
- **`Azure Front Door`**
- **`Azure Application Gateway`**

💡 **Explanation:**
1. **Azure Front Door (Global Layer 7 Edge):** Routes global traffic to the region with lowest latency (Anycast), provides automatic cross-region failover, and enforces HTTPS with SSL offloading at the edge.
2. **Azure Application Gateway (Regional Layer 7 with AGIC):** Acts as the Ingress Controller inside each region to route requests to backend AKS microservice pods based on URL paths (`/api/*`), satisfying the single-domain path-based routing requirement.

---

#### Question 4: Asset Migration to Azure Storage
**Question:** The total size of the product assets files (containing images and videos) in the Network Attached Storage (NAS) file share is 35G. You need to migrate the assets over a content delivery network (CDN) to improve the performance of the retail store. Which solution should you recommend to migrate the files to a storage account?

- [x] AzCopy
- [ ] Azure Data Box
- [ ] Azure Storage Explorer
- [ ] Azure File Sync

**Correct Answer:** **`AzCopy`**  
💡 **Explanation:** The dataset is only 35 GB. **AzCopy** is a high-speed CLI tool designed to upload files and media assets directly from on-premises file shares to Azure Blob Storage over the internet with automatic retry and scriptability. Azure CDN integrates natively with Blob Storage. Using Data Box for 35 GB is completely unnecessary (Data Box is for 40 TB+).

---

#### Question 5: Asynchronous Microservice Messaging
**Question:** The invoice and billing API is required to send information to the document generator API whenever a transaction is made. You need to identify which communication type and communications service are required to establish a connection between these APIs to send the transaction details. Which communication type and communications service should you identify? To answer, select the appropriate options in the answer area.

**Dropdown Selections & Answers:**
1. **Communication type: [ `Asynchronous` ]**
   - *Options:* `Asynchronous` | `Synchronous` | `REST API calls`
   - *Explanation:* Asynchronous messaging completely decouples the invoice/billing API from document generation, preventing synchronous request timeouts and enabling both microservices to scale independently.
2. **Communications service: [ `Service Bus queues` ]**
   - *Options:* `Service Bus queues` | `Service Bus topics` | `Azure queue storage`
   - *Explanation:* Service Bus queues provide point-to-point 1-to-1 reliable messaging with enterprise delivery guarantees, message deduplication, and dead-letter queues.

📚 **References:**
- *Microservices architecture on Azure Kubernetes Service (AKS)*
- *Use Azure Private Link to securely connect networks to Azure SQL Database*
- *Multi-region web application with Azure Front Door and Application Gateway*
- *Copy or move data to Azure Storage by using AzCopy*
- *Asynchronous messaging options in Azure*


---

### Question 64
**Domain:** Design Infrastructure Solutions
**Subdomain:** Design routing and load-balancing solutions
**Type:** Multiple Choice

#### Question
Your company is developing a solution based on a microservices architecture. Rather than exposing services directly to users, they should be accessed through an API gateway that supports:

* Load balanced access to services
* Support for HTTP/HTTPS and layer 7 routing
* SSL termination
* Autoscaling based on traffic patterns
* Protection from common exploits and vulnerabilities

You need to recommend an API gateway solution that meets these requirements.

What should you recommend?

#### Options
A. Azure Traffic Manager
B. Azure Application Gateway
C. API Management (APIM)
D. Azure Load Balancer

#### Correct Answer
**Azure Application Gateway**

#### Explanation
You should recommend Azure Application Gateway as your API gateway solution. Azure Application Gateway meets all the solution requirements. Protection against common exploits and vulnerabilities is provided through Web Application Firewall (WAF), which is a feature of Azure Application Gateway. Application Gateway is a management solution designed to manage traffic to web applications.

You should not recommend APIM. APIM is an API management suite that lets you create consistent and modern API gateways for existing back-end services. It gives you a way to publish APIs to external, partner, and internal developers. APIM supports features for managing a public-facing API, but it does not meet all the requirements such as load balancing.

You should not recommend Azure Traffic Manager. Azure Traffic Manager operates as a DNS-based (DNS-level) load balancer and provides global load balancing across multiple regions. It is not appropriate for this scenario because it resolves DNS queries only and does not terminate SSL/TLS or perform Layer 7 request routing.

You should not recommend Azure Load Balancer. Load Balancer operates at layer 4 rather than layer 7 and, other than load balancing, it does not meet the scenario requirements. It does not include any security protections.

**Reference:** [Microsoft Learn](https://learn.microsoft.com/en-us/azure/application-gateway/overview)


---

### Question 65
**Domain:** Design Infrastructure Solutions
**Subdomain:** Design compute solutions
**Type:** Multiple Choice

#### Question
Your team is planning to develop several container-based applications using microservice architecture. You want to deploy the applications so that they can run independently and communicate with each other easily, with automatic service discovery, scaling, and orchestration across many microservices. Hosting these applications should require minimal operation effort once deployed.

You need to choose a service to host the applications.

Which service should you use?

#### Options
A. Azure Kubernetes Service (AKS)
B. Web App for Containers
C. Azure Service Fabric
D. Azure Container Instance

#### Correct Answer
**Azure Kubernetes Service (AKS)**

#### Explanation
You should use Azure Kubernetes Service (AKS). AKS is a managed Kubernetes service to orchestrate container applications. Applications deployed in AKS can run independently and communicate with each other easily. The orchestration capabilities allow easy service discovery, automatic scaling, and self-healing across many microservices.

You should not use Azure Container Instance (ACI). ACI is good for running container-based applications that are standalone. Since it does not have orchestration capabilities, it will be difficult to achieve easy network communication between the multiple applications or to autoscale and coordinate many interdependent microservices.

You should not use Web App for Containers. This uses Azure App Service and provides the platform for deploying your applications in the form of containers. However, similar to ACI, it lacks orchestration capabilities.

You should not use Azure Service Fabric. Service Fabric is also a good service that allows reliable microservice deployment and lifecycle. However, it is a little difficult to develop and manage applications for Service Fabric compared to AKS.

**Reference:** [Microsoft Learn](https://learn.microsoft.com/en-us/azure/aks/intro-kubernetes)


---

### Question 66
**Domain:** Design Infrastructure Solutions
**Subdomain:** Design compute solutions
**Type:** Multiple Select

#### Question
CompanyA, which operates in East US only, is modernizing its infrastructure by moving to the cloud. The Enterprise resource planning (ERP) web application, which runs on virtual machines (VMs) and cannot be modified needs to be migrated to Azure as it is.

You need to recommend a solution for migration. Your solution must meet the following requirements:

* The solution should be available if a datacenter (availability zone) fails.
* Cost and administrative effort must be minimized.

Which two solutions should you recommend? Each correct answer presents part of the solution.

#### Options
A. Deploy an Azure Traffic Manager profile.
B. Deploy a load balancer.
C. Deploy a web app across two regions.
D. Deploy a VM scale set across two availability zones.

#### Correct Answer
- **Deploy a load balancer.**
- **Deploy a VM scale set across two availability zones.**

#### Explanation
You should deploy a VM scale set across two availability zones and a load balancer to meet the requirements. Availability zones are physically separate datacenters within a region; deploying the unmodifiable ERP application on VMs in a scale set across zones, fronted by a zone-redundant Azure load balancer, keeps the app available if one datacenter (zone) fails, with minimal administrative effort.

You should not deploy a web app across two regions. Since CompanyA operates only in East US and there is no interregional availability required, deploying a web app across two regions is not necessary. Deploying a web app across multiple regions also increases costs for the interregional data transfer.

You should not deploy an Azure Traffic Manager profile. Azure Traffic Manager is an Azure load balancing solution which is used to distribute traffic to multiple service endpoints across Azure regions for availability or performance purposes. Since there is no interregional availability required, deploying Azure Traffic Manager is not needed.

**Reference:** [Microsoft Learn](https://learn.microsoft.com/en-us/azure/virtual-machine-scale-sets/overview)


---

### Question 67
**Domain:** Design Infrastructure Solutions
**Subdomain:** Design network and application security solutions
**Type:** Multiple Choice

#### Question
Your company plans to expand its Azure footprint by deploying 10 virtual machines that will host a critical e-commerce application. Recently the company was targeted by a layer 7 DDoS attack that flooded the e-commerce app with invalid requests, causing an outage.

You need to recommend a solution to protect against these DDoS attacks.

Which Azure service should you recommend?

#### Options
A. Azure Load Balancer
B. Azure Traffic Manager
C. Azure Application Gateway
D. Azure DDoS Protection

#### Correct Answer
**Azure Application Gateway**

#### Explanation
You should recommend your company to use Azure Application Gateway. A DDoS attack occurs when a malicious actor tries to overload a system by sending invalid requests. Azure Application Gateway, which is a Layer 7 load balancing and traffic management service, can be used to filter these requests utilizing features offered by Azure Web Application Firewall (WAF). The gateway operates at layer 7 of the Open Systems Interconnection (OSI) model, which means it can make load balancing decisions based on complex rules, including Uniform Resource Locator (URL) based routing. This contrasts with traditional load balancers that work at layer 3 or layer 4 of the OSI model and block traffic primary based on IP addresses and ports. In this scenario, you should deploy Application Gateway WAF v2 SKU, which includes the WAF DDoS feature.

You should not recommend your company to use Azure DDoS Protection. This service works at layers 3 and 4 of the OSI model. It does not have access to layer 7 data and cannot block layer 7 DDoS attacks.

You should not recommend your company to use Azure Load Balancer. Similar to Azure DDoS Protection, Azure Load Balancer works at layer 4 of the OSI model. While this service can be used to balance network traffic loads based on Transmission Control Protocol (TCP) port numbers, it cannot be used to block layer 7 DDoS attacks.

You should not recommend your company to use Azure Traffic Manager. This service uses Domain Name System (DNS) requests to load balance traffic across your Azure footprint. When a client requests a specific host, Traffic Manager can route the request to and endpoint using rules you define. Traffic Manager is not used to block layer 7 DDoS attacks.

**Reference:** [Microsoft Learn](https://learn.microsoft.com/en-us/azure/web-application-firewall/ag/ag-overview)


---

### Question 68
**Domain:** Design Infrastructure Solutions
**Subdomain:** Design routing and load-balancing solutions
**Type:** Multiple Choice

#### Question
Your company has an on-premises Active Directory (AD) domain and a Microsoft Entra subscription. You are designing an Azure internet-facing web application to be deployed in the West Europe Azure region. Network traffic for the application must support load-balanced distribution throughout the region.

Your load balancing solution must:

* Provide application layer (OSI layer 7) load balancing for HTTPS protocol traffic.
* Support URL-routing.
* Control routing through round-robin sequencing.
* Provide Secure Sockets Layer (SSL/TLS) termination.

You need to recommend a load-balancing solution. You want to minimize the solution cost and management overhead.

What is the best solution to use?

#### Options
A. Azure Application Gateway
B. Azure Load Balancer
C. Azure Traffic Manager
D. Azure Front Door

#### Correct Answer
**Azure Application Gateway**

#### Explanation
You should recommend Azure Application Gateway as your load-balancing solution. Application Gateway implements an OSI layer 7 load-balancing solution, which is necessary to balance HTTPS traffic. Load balancing is supported in a round-robin manner, cycling through available instances. Application Gateway supports URL routing. It supports SSL/TLS termination, also known as SSL offload. Therefore, traffic is unencrypted at the gateway and sent to backend servers as clear text.

You should not recommend Azure Load Balancer. You can use an Azure load balancer as a public or internal load balancer, but it does not support all of the features needed. For example, Azure Load Balancer operates as OSI layer 4 and does not support SSL/TLS termination.

You should not recommend Azure Front Door or Azure Traffic Manager. These are both global load balancing solutions, which means they are designed for balancing traffic between regions, including on-premises instances. You do not need a global load-balancing solution because your application is deployed in a single Azure region. Azure Traffic Manager is additionally unsuitable because it is a DNS-based traffic router and does not terminate TLS at all. Azure Front Door does terminate TLS and supports end-to-end TLS with re-encryption to the backend, so it would meet the functional requirements; it is excluded here only because it is a global service and would cost more than an Application Gateway for a single-region workload.

Apart from being a global balancing solution, Azure Front Door would meet the solution requirements, but it is not a recommended solution in this type of scenario, and it would be a more expensive solution to implement.

**Reference:** [Microsoft Learn](https://learn.microsoft.com/en-us/azure/application-gateway/overview)


---

### Question 69
**Domain:** Design Infrastructure Solutions
**Subdomain:** Design message broker and decoupled messaging solutions
**Type:** Multiple Choice

#### Question
You run an online shop web application in Azure. If a customer buys one or multiple products, the web application has to send the purchase and shipping details grouped in a single transaction to accounting and warehouse applications for further processing. Both the accounting and warehouse applications must receive the transactions without polling them (without constantly querying whether a transaction is ready).

You need to recommend a solution to facilitate this.

What should you recommend?

#### Options
A. Azure Queue Storage
B. Azure Service Bus topics
C. Azure Service Bus queues
D. Azure Event Hubs

#### Correct Answer
**Azure Service Bus topics**

#### Explanation
You should recommend Azure Service Bus topics. Communications between Azure services take place using messaging. One of the Azure solutions to transport messages asynchronously from one service to the other is Azure Service Bus. Azure Service Bus is a message broker to decouple applications and services from each other. Azure Service Bus provides two message delivery solutions: queues and topics. Azure Service Bus topics deliver messages from a single source to multiple receivers with multiple destinations. In this scenario, the online shop web application sends messages to Azure Service Bus topics. The accounting and warehouse applications can subscribe to the topic and receive messages through an event-driven receiver (message handler) rather than by continuously polling the service themselves.

You should not recommend Azure Queue Storage. Azure Queue Storage is a service for storing a large amount of messages. It can be used to track the message processing within the queue. For example, if message processing crashes while in progress, another process can pick up the crashed information and continue at the point where the previous process stopped. Azure Queue Storage is designed so that the receiver has to actively poll and check whether messages are available. In this scenario, the receiver has to receive the message without polling it, so this does not meet the goal.

You should not recommend Azure Service Bus queues. Similar to Azure Service Bus topics, Azure Service Bus queues deliver messages from one service (sender) to another service (receiver). However, Azure Service Bus queues can deliver messages only to a single receiver. As soon as the message is delivered, it is de-queued and removed from the queue, and as such the next receiver cannot receive the message.

You should not recommend Azure Event Hubs. Event Hubs is a distributed data-streaming platform, which can be integrated within your message communication pipeline between disjointed services. For example, Event Hubs can receive streaming data from multiple senders, aggregate it, and deliver the data to a storage solution (for example, Azure Service Bus), so that it is ready to be picked up by a receiving service.

**Reference:** [Microsoft Learn](https://learn.microsoft.com/en-us/azure/service-bus-messaging/service-bus-queues-topics-subscriptions)


---

### Question 70
**Domain:** Design Infrastructure Solutions
**Subdomain:** Design networking connectivity solutions
**Type:** Multiple Choice

#### Question
Your company has two Azure subscriptions named Subscription1 and Subscription2. Both subscriptions are associated with the same Active Directory (AD) tenant.

Subscription1 includes the following virtual network:

* Name: VNET1
* Address space: 10.1.0.0/16
* Location: (US) Central US
* Number of connected virtual machines (VMs): 200

Subscription2 includes the following virtual network:

* Name: VNET2
* Address space: 192.168.0.0/16
* Location: (Europe) North Europe
* Number of connected virtual machines (VMs): 100

You need to recommend a connectivity solution that enables the VMs on VNET1 and VNET2 to communicate over the Microsoft backbone infrastructure.

What should you recommend?

#### Options
A. ExpressRoute
B. Peering
C. Point-to-Site VPN
D. Site-to-Site VPN

#### Correct Answer
**Peering**

#### Explanation
You should recommend virtual network peering. Virtual network peering enables you to connect Azure virtual networks across regions and Azure subscriptions seamlessly. For connectivity purposes, peered virtual networks appear as one network. The traffic between VMs in the peered virtual networks is routed through the Microsoft backbone infrastructure, much like traffic is routed between VMs in the same virtual network. You can peer virtual networks that exist in two different subscriptions as long as a privileged user of both subscriptions authorizes the peering and the subscriptions are associated with the same AD tenant.

You should not recommend ExpressRoute. ExpressRoute establishes connectivity between an on-premises network and an Azure virtual network over a private connection via a connectivity provider, not over the Microsoft backbone infrastructure between Azure VNets.

You should not recommend Site-to-Site VPN. Site-to-Site VPN establishes connectivity over a public network, and not over Microsoft backbone infrastructure.

You should not recommend Point-to-Site VPN. Point-to-Site VPN can be used to establish connectivity between a single computer and a virtual network. Point-to-Site VPN cannot be used to establish connectivity between virtual networks. Point-to-Site VPN establishes connectivity over a public network, not over Microsoft backbone infrastructure.

**Reference:** [Microsoft Learn](https://learn.microsoft.com/en-us/azure/virtual-network/virtual-network-peering-overview)


---

### Question 71
**Domain:** Design Infrastructure Solutions
**Topic:** Solution Evaluation - Retail Spikes Autoscaling & Server Control
**Type:** Case Study / Solution Evaluation Series

#### Scenario
You are assisting a startup that is planning to launch an online retail platform that sells a wide range of products. The platform's success depends on providing a seamless shopping experience to customers while efficiently managing unpredictable traffic spikes during promotions and sales events. The platform requires control over the server resources.

You need to recommend a solution to meet requirements for significantly increased traffic during Black Friday promotion sales, so that the system can automatically handle the increased load in the most efficient way.

*Note: This case study contains a series of questions that present the same scenario. Each question in the series contains a unique solution that might meet the stated goals. Note: You cannot go back or review questions of this type on the actual certification exam.*

##### Part 1
**Proposed Solution:** You recommend serverless computing.
**Question:** Does this solution meet the goal?
**Correct Answer:** **No**
**Explanation:** This solution does not meet the goal. Serverless computing, often referred to as "serverless", is a cloud computing model that allows developers to build and run applications without the need to manage underlying infrastructure or servers. In a serverless architecture, developers focus on writing code to implement specific functions or tasks, and the cloud provider takes care of provisioning, scaling, and managing the necessary compute resources. This abstraction of infrastructure management frees developers from the operational complexities of traditional server management. While serverless platforms can automatically scale resources to handle traffic spikes, they do not provide server control, which might not align with the requirement for control over server resources.

##### Part 2
**Proposed Solution:** You recommend to request your IT department to provision additional virtual machines as needed.
**Question:** Does this solution meet the goal?
**Correct Answer:** **No**
**Explanation:** This solution does not meet the goal. Although requesting additional virtual machines could help to scale resources, it might not be as automatic and dynamic as needed to handle sudden traffic spikes efficiently. Manually provisioning VMs can be time consuming and may not respond quickly to sudden traffic spikes.

##### Part 3
**Proposed Solution:** You recommend microservice architecture to run each service in its own isolated containers, with horizontal autoscaling configured per service.
**Question:** Does this solution meet the goal?
**Correct Answer:** **Yes**
**Explanation:** This solution meets the goal. The microservice architecture recommended allows different services, such as inventory updates, cart calculations, and payment processing, to run independently in isolated containers. This promotes modularity, scalability, and efficient resource utilization. Microservice architecture is an architectural style used in software development to design and build applications as a collection of small, independent, and loosely coupled services. In contrast to monolithic architectures, where the entire application is developed as a single unit, microservices break down the application into smaller, independently deployable services that communicate with each other through well-defined APIs. Each service in a microservices architecture focuses on a specific business capability and can be developed, deployed, and scaled independently. Microservices, each running in its own isolated container, offering control over server resources. You can scale individual microservices independently, and with horizontal autoscaling configured - for example the Horizontal Pod Autoscaler in Azure Kubernetes Service - each service scales out automatically in response to its own demand, so a spike in one service does not require scaling the whole application.

##### Part 4
**Proposed Solution:** You recommend implementing a VM autoscaling mechanism.
**Question:** Does this solution meet the goal?
**Correct Answer:** **Yes**
**Explanation:** This solution meets the goal. Implementing an autoscaling mechanism enables the gradual reduction of the number of virtual machines (VMs) and containers as traffic increases and then returns to normal levels after the promotion. Autoscaling mechanisms automatically adjust resources based on demand, helping to conserve resources and optimize costs. Azure Virtual Machines autoscaling is a feature that allows you to dynamically adjust the number of VM instances based on demand, ensuring optimal performance and cost efficiency. It automates the process of scaling up or down based on predefined rules and conditions, so you can accommodate varying workloads without manual intervention. This feature is particularly useful when your application experiences fluctuations in traffic or resource utilization.

**References:**
- [Microsoft Learn](https://learn.microsoft.com/en-us/azure/virtual-machine-scale-sets/virtual-machine-scale-sets-autoscale-overview)
- [Microsoft Learn](https://learn.microsoft.com/en-us/azure/aks/concepts-scale)


---

### Question 72
**Domain:** Design Infrastructure Solutions
**Subdomain:** Design secure access and remote management solutions
**Type:** Multiple Choice

#### Question
You have an Azure virtual machine (VM) named Vm1 running Windows Server 2019.

Vm1 must not have a public IP address attached to it, and the RDP port must not be published to the internet or reachable through an inbound NAT rule.

You need to access Vm1 using a Remote Desktop Protocol (RDP) session.

What should you use?

#### Options
A. Azure Firewall
B. Azure Bastion
C. Virtual network peering
D. Azure Front Door

#### Correct Answer
**Azure Bastion**

#### Explanation
You should use Azure Bastion. Azure Bastion is a service that you can provision in your virtual network to provide RDP and SSH connectivity to your Azure VMs without needing to attach a public IP address to your VMs. It creates a secure connection to access your VMs without having to manage network security groups to allow RDP connection to your VMs.

You should not use Azure Firewall. Azure Firewall is a managed, cloud-based network security service that centralizes network filtering for a virtual network. You could publish RDP to Vm1 with a DNAT rule, but that publishes the RDP port on the firewall's public IP address and requires you to maintain the DNAT and network rules, which the requirements exclude.

You should not use virtual network peering. You can use virtual network peering to integrate two virtual networks, in the same or different Azure regions, using the Microsoft private network. You cannot use only virtual network peering to connect to a private Azure VM and start an RDP session.

You should not use Azure Front Door. Azure Front Door works as a global HTTP/HTTPS layer load balancer. It is integrated with Microsoft Content Delivery Network (CDN) and DNS-based global routing. Azure Front Door supports a range of traffic routing methods for DNS-based routing, such as a latency-based traffic routing that routes the web traffic to the closest region.

**Reference:** [Microsoft Learn](https://learn.microsoft.com/en-us/azure/bastion/bastion-overview)


---

### Question 73
**Domain:** Design Infrastructure Solutions
**Subdomain:** Design API management and governance solutions
**Type:** Multiple Select

#### Question
Your company wants autonomous teams to manage their own APIs on a shared Azure API Management service, each with their own role-based access, and to run some API gateways next to backends that are on-premises and in other clouds.

You need to recommend a solution.

What should you recommend?

Each correct answer presents part of the solution.

#### Options
A. API Management workspaces per team
B. Azure Front Door origin groups
C. A separate service per team
D. The API Management self-hosted gateway
E. Application Gateway path-based routing

#### Correct Answer
- **API Management workspaces per team**
- **The API Management self-hosted gateway**

#### Explanation
You should recommend API Management workspaces per team. Workspaces let each team manage its own APIs, products, and subscriptions with its own role-based access on a shared API Management service.

You should recommend the API Management self-hosted gateway. The self-hosted gateway runs the API Management gateway next to on-premises and multicloud backends, so teams can serve APIs close to those backends.

You should not recommend a separate service per team. Separate services remove the shared platform and multiply cost and operations, which is the opposite of the federated model requested.

You should not recommend Application Gateway path-based routing. Application Gateway is a web traffic load balancer, not an API management platform with per-team governance.

You should not recommend Azure Front Door origin groups. Front Door is a global entry point for routing and acceleration, not a per-team API management solution.

**Reference:** [Microsoft Learn](https://learn.microsoft.com/en-us/azure/api-management/workspaces-overview)


---

### Question 74
**Domain:** Design Infrastructure Solutions
**Subdomain:** Design migration and adoption strategies
**Type:** Drag and Drop / Ordering

#### Question
A company is modernizing its infrastructure by moving workloads to the cloud. These workloads comprise virtual machines, databases, and applications.

You need to identify the appropriate phases of workload migration according to the Microsoft Cloud Adoption Framework for Azure.

Which three steps should you identify in sequence? To answer, move the appropriate actions from the list of possible actions to the answer area and arrange them in the correct order.

#### Available Options
- Assess
- Deploy
- Ready
- Release
- Plan

#### Correct Order
1. **Assess**
2. **Deploy**
3. **Release**

#### Explanation
You should identify the following migration steps in order:
1. Assess
2. Deploy
3. Release

The Microsoft Cloud Adoption Framework provides you with guidelines to construct a plan for your journey into the cloud. The Microsoft Cloud Adoption Framework envisages the following main methodologies: Define strategy, Plan, Ready, Migrate, and Innovate.

First, during the assessment step of the Migrate methodology, you should assess your workloads in terms of calculating the migration costs and determining the required modernization effort and deployment tools.

Next, you should deploy your workloads by moving them, either without modernizing (lift-and-shift) or modernized, into the cloud.

Finally, you should test, optimize, and document your migrated workloads and, if the result is as expected, then you can release the workloads to your users. During this phase you should hand over workloads and documentation to your operation, security, and governance teams.

You should not identify Plan as one of the Migration steps. According to the Microsoft Cloud Adoption Framework, during the Plan step you assess your digital estate (which workloads you can move as they are, which have to be modernized or rebuilt, and which workloads you do not need anymore), align it with the business outcomes, evaluate skill gaps, and plan for adoption & change management. As such, the Plan step has to be carried out before you start your migration.

You should not identify Ready as one of the Migration steps. According to the Microsoft Cloud Adoption Framework, during the Ready step you need to create your target environment, called the landing zone. As soon as your landing zone is in place, you are ready to start migration.

**Reference:** [Microsoft Learn](https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/migrate/)


---

### Question 75
**Domain:** Design Infrastructure Solutions
**Subdomain:** Design compute solutions
**Type:** Drag and Drop / Matching

#### Question
Your company has several development projects planned. These include moving existing applications to the cloud and developing new applications for initial release in the cloud.

You need to identify the most appropriate compute service for each project requirement.

Which compute service should you recommend? To answer, drag the appropriate compute service to each requirement. A compute service may be used once, more than once, or not at all.

#### Matching Pairs
- **To migrate a web app and API from an on-premises deployment to the cloud when the app cannot be containerized** ➔ `Azure App Service`
- **To develop a new app that supports an event-driven workload based on short-lived processes** ➔ `Azure Functions`
- **To develop a microservices architecture app that requires full orchestration and .NET integration** ➔ `Azure Kubernetes Service (AKS)`
- **To migrate an on-premises, cloud-optimized, high-performance computing (HPC) workload application** ➔ `Azure Batch`

#### Available Options / Distractors
- Azure App Service
- Azure Functions
- Azure Kubernetes Service (AKS)
- Azure Batch
- Azure VM

#### Explanation
You should use Azure App Service when you need to migrate a web app and API from an on-premises deployment to the cloud when the app cannot be containerized. App Service is a managed service for hosting web apps, mobile app back ends, RESTful APIs, or automated business processes. It is an appropriate hosting option for web apps and APIs that cannot be containerized. However, App Service also allows you to run the applications as containers too.

You should use Azure Functions as the most appropriate solution when you need to develop a new app that supports an event-driven workload based on short-lived processes. Azure Functions lets you run small pieces of code without having to worry about application infrastructure. Azure Functions can respond to Event Hubs, Event Grid, Blob events, and queue messages, among other triggers.

You should choose Azure Kubernetes Service (AKS) clusters as your service option when you need to develop a microservices architecture app that requires full orchestration and .NET integration. This is a fully managed and orchestrated Kubernetes service. AKS includes support for .NET.

You should use Azure Batch when migrating an on-premises, cloud-optimized, high-performance computing (HPC) workload application. An HPC workload uses several CPU or GPU-based computers to solve complex mathematical tasks and it is best suited to Azure Batch.

Azure VM is not the best solution for any of the development and deployment requirements. You would choose this as your solution when you needed full control over the application environment and operating system configuration.

**Reference:** [Microsoft Learn](https://learn.microsoft.com/en-us/azure/architecture/guide/technology-choices/compute-decision-tree)


---

### Question 76
**Domain:** Design Infrastructure Solutions
**Subdomain:** Design caching and in-memory data solutions
**Type:** Multiple Choice

#### Question
Your company caches data in Azure Managed Redis. The cache is bound by throughput and latency rather than by dataset size, and the team wants the tier that gives the most vCPUs for that profile.

You need to recommend a tier.

What should you recommend?

#### Options
A. The Balanced tier
B. The Flash Optimized tier
C. The Compute Optimized tier
D. The Memory Optimized tier

#### Correct Answer
**The Compute Optimized tier**

#### Explanation
You should recommend the Compute Optimized tier. The Compute Optimized tier has the lowest memory-to-vCPU ratio, so it provides the most processing power for throughput-bound and latency-bound workloads.

You should not recommend the Memory Optimized tier. The Memory Optimized tier has a high memory-to-vCPU ratio for memory-bound workloads, not for maximum throughput.

You should not recommend the Balanced tier. The Balanced tier offers a middle memory-to-vCPU ratio for standard workloads, so it does not give the most processing power for a throughput-bound cache.

You should not recommend the Flash Optimized tier. The Flash Optimized tier moves cold data to NVMe storage to lower cost for large datasets, which trades away some performance.

**Reference:** [Microsoft Learn](https://learn.microsoft.com/en-us/azure/azure-cache-for-redis/managed-redis/overview)


---

### Question 77
**Domain:** Design Infrastructure Solutions
**Subdomain:** Design compute solutions
**Type:** Multiple Choice

#### Question
Your company runs an event-driven API on Azure Functions. The functions must integrate with backend services that are isolated in a virtual network, and the solution must reduce cold starts while keeping a serverless, consumption-based cost model.

You need to recommend a hosting plan.

What should you recommend?

#### Options
A. The Premium plan
B. The Consumption plan
C. The Flex Consumption plan
D. An App Service plan

#### Correct Answer
**The Flex Consumption plan**

#### Explanation
You should recommend the Flex Consumption plan. The Flex Consumption plan is a serverless, consumption-based plan that supports virtual network integration and always-ready instances to reduce cold starts.

You should not recommend the Consumption plan. The Consumption plan is serverless but does not support virtual network integration, so the functions cannot reach the network-isolated backends.

You should not recommend the Premium plan. The Premium plan supports virtual network integration and reduces cold starts, but it bills on pre-warmed instances rather than a consumption-based model.

You should not recommend an App Service plan. An App Service plan runs on dedicated instances billed continuously, so it is not a serverless, consumption-based option.

**Reference:** [Microsoft Learn](https://learn.microsoft.com/en-us/azure/azure-functions/flex-consumption-plan)


---

### Question 78
**Domain:** Design Infrastructure Solutions
**Subdomain:** Design routing and load-balancing solutions
**Type:** Multiple Choice

#### Question
You manage a global e-commerce application named App1. App1 is hosted on multiple virtual machines in the United States. The website has grown in size and popularity and you deployed new virtual machines in Europe to host App1. However, European customers are reporting slow page-load times.

You need to design a strategy that ensures that user requests always connect to the closest datacenter in their region. The solution must maximize service uptime in the event of a catastrophic natural disaster. The solution must also minimize administrative effort.

What should you do?

#### Options
A. Use Azure Application Gateway to configure multiple-site hosting.
B. Use Azure Traffic Manager to create load-balanced connections.
C. Use PowerShell to create a public load balancer.
D. Create additional load-balanced VMs in the European regions.

#### Correct Answer
**Use Azure Traffic Manager to create load-balanced connections.**

#### Explanation
You should use Azure Traffic Manager to create load-balanced connections. Azure Traffic Manager is appropriate when you have a large, globally-distributed application or service and you need the maximum protection from any kind of failure, even an entire datacenter. Azure Traffic Manager will also connect to the nearest datacenter for maximum potential performance (using Geographic or Performance routing).

You should not use PowerShell to create a public load balancer. Although this approach can increase availability and distribute requests across multiple VMs, it does not maximize uptime across regions. This option also does not direct user requests to the nearest datacenter.

You should not use Azure Application Gateway to configure multiple-site hosting. Azure Application Gateway is used to load-balance web traffic within a region. Azure Application Gateway has more sophisticated controls over how to route traffic than a traditional load balancer. This option does not ensure maximum uptime in the event of a serious service failure and does not direct user traffic to the nearest datacenter across regions.

You should not create additional load-balanced VMs in the European regions. This solution can increase performance and reliability, but it does not minimize administrative effort. The application could also potentially develop the same performance problems in other regions. For example, if the website becomes popular in East Asia, load-balanced VMs in Europe will not help.

**Reference:** [Microsoft Learn](https://learn.microsoft.com/en-us/azure/traffic-manager/traffic-manager-overview)


---

### Question 79
**Domain:** Design Infrastructure Solutions
**Subdomain:** Design messaging and event-driven architectures
**Type:** Drag and Drop / Ordering

#### Question
Your company designs an application based on the Azure microservices architecture that will:

* Receive up to thousands of events per second from environmental sensors.
* Submit events in real-time for formatting and pre-processing.
* Ignore missed or improperly formatted data without interrupting the stream.
* Write formatted event data to a Cosmos DB database.

The number of events per second can vary widely.

You need to determine which Azure services are necessary to support the solution. You want to keep costs to a minimum.

Which Azure services should you include? To answer, drag the appropriate services to the correct answer areas. Each service may be used once, more than once, or not at all.

#### Correct Pipeline Architecture
Environmental data sensors ➔ Azure Event Hubs ➔ Azure Functions ➔ Cosmos DB

#### Explanation
You should use Azure Event Hubs and Azure Functions in your solution. Azure Event Hubs can receive data for up to millions of events per second and pass them in real time to the event consumer. In this design, you will use Azure Functions as the event consumer, which will handle the processing and write the data to a Cosmos DB database. Both Event Hubs and Functions automatically scale as the data volume changes.

You should not include Azure Event Grid in your solution. Event Grid is not designed for this type of application. It manages events (reactive notifications), but it is not a data pipeline that delivers the event data streaming ingestion.

You should not include Azure Service Bus. Service Bus is used for asynchronous message delivery, such as traditional transaction-processing applications. Service Bus does not stream data to a consumer but, instead, it delivers data when polled.

You should not include Azure Logic Apps in your solution. Logic Apps is designed to help you to schedule, automate, and orchestrate tasks, business processes, and workflows. Therefore, it is not suited to this type of high-throughput data pipeline requirement.

You should not include Azure Notification Hubs. Notification Hubs is not used for data streaming or real-time data processing. Notification Hubs is a push engine designed to let you send notifications out to any platform and it is not used for application data storage and delivery.

**Reference:** [Microsoft Learn](https://learn.microsoft.com/en-us/azure/event-hubs/event-hubs-about)


---

### Question 80
**Domain:** Design Infrastructure Solutions
**Subdomain:** Design migration and compute modernization solutions
**Type:** Dropdown / Matching

#### Question
Your company has an on-premises solution with the following components:

* A website hosted in Internet Information Services (IIS) that contains only static HTML files, images, and JavaScript files. The JavaScript files call a web service.
* A web service hosted in IIS on a separate server. It is written in C# and exposes a single method over HTTP that reads from a SQL Server database and returns the result.
* A SQL Server database that contains three tables and one stored procedure.

You plan to migrate the solution to Azure. For each component, you need to choose the Azure service that provides the required functionality with the least administrative effort and without requiring you to manage an operating system.

Which service should you choose for each component? To answer, select the appropriate options from the drop-down menus.

#### Dropdown Selections
- **Website** ➔ `Azure Static Web Apps`
- **Web service** ➔ `Azure Functions`
- **Database** ➔ `Azure SQL Database`

#### Explanation
You should choose Azure Static Web Apps for the website. The website contains only static HTML, image, and JavaScript files. Azure Static Web Apps is a managed service that provides web hosting, globally distributed static content, and automatically renewing SSL certificates, without requiring you to manage an operating system or a web server.

You should choose Azure Functions for the web service. The service exposes a single HTTP endpoint implemented in C#. An HTTP-triggered function runs that method in a fully managed environment, so you do not need to manage an operating system or a web server.

You should choose Azure SQL Database for the database. Azure SQL Database is a fully managed platform as a service (PaaS) database engine, based on the SQL Server database engine, that handles most database management functions such as upgrading, patching, backups, and monitoring without user involvement. This allows you to migrate the existing tables and stored procedure without managing an operating system or a SQL Server instance.

**Reference:** [Microsoft Learn](https://learn.microsoft.com/en-us/azure/static-web-apps/overview)


---

### Question 81
**Domain:** Design Data Storage Solutions
**Subdomain:** Design relational data storage solutions
**Type:** Multiple Choice

#### Question
You are designing the database tier of a business-critical application in Azure SQL Database. The database is expected to grow beyond 10 TB.

You need to recommend a service tier that meets the following requirements:

* Compute and storage must scale independently.
* At least one secondary replica must serve read-only analytics queries.

What should you recommend?

#### Options
A. The vCore-based Business Critical service tier
B. The DTU-based Premium service tier
C. The vCore-based Hyperscale service tier
D. The vCore-based General Purpose service tier

#### Correct Answer
**The vCore-based Hyperscale service tier**

#### Explanation
You should recommend the vCore-based Hyperscale service tier. Hyperscale separates the compute tier from its distributed storage architecture, allowing storage capacity and compute resources to scale independently. It supports databases larger than 10 TB (up to 100 TB) and read-only secondary replicas that can offload analytics workloads from the primary replica.

You should not recommend the vCore-based Business Critical service tier. Business Critical is limited to a maximum database size of 4 TB in Azure SQL Database, so it cannot host a database that is expected to grow beyond 10 TB, and its architecture does not provide independent compute and storage scaling.

You should not recommend the vCore-based General Purpose service tier. General Purpose does not provide the read-only secondary replica capability required to offload the analytics workload.

You should not recommend the DTU-based Premium service tier. The DTU purchasing model uses bundled units of compute, memory, and I/O and does not provide the independent compute and storage scaling required by the scenario.

**Reference:** [Microsoft Learn](https://learn.microsoft.com/en-us/azure/azure-sql/database/service-tier-hyperscale)


---

### Question 82
**Domain:** Design Data Storage Solutions
**Subdomain:** Design data analytics and processing solutions
**Type:** Multiple Choice

#### Question
You work at a retail company that stores large amounts of data in relational and non-relational databases, and that has file storage in both cloud and an on-premises datacenter. The company decides to analyze some data in real time to update its dashboards. The data will also be used to train the machine-learning model that will be used to provide recommendations in the online store.

You need to recommend a solution to gather actionable insights from the data being collected.

What should you recommend?

#### Options
A. Azure Data Factory
B. Azure Stream Analytics
C. Azure Data Lake
D. Azure Databricks

#### Correct Answer
**Azure Databricks**

#### Explanation
You should recommend Azure Databricks for this scenario. With Databricks, you can run big data pipelines using both batch and real-time data. It can gather data from the Data Factory in batches and, for real-time data, Event Hubs or IoT Hub can be used. You can also train machine-learning models inside your Databricks workspaces. It uses Spark, which is a large-scale data-analytics language that can perform all the required actions.

You should not recommend Azure Data Lake. Data Lake is purely a storage solution and it cannot perform any analytics on the data. The data collected is generally unstructured, in the form of blobs and files. To analyze the data, you can use any Hadoop filesystem (HDFS) framework. Data Lake can also store data from real-time services like Event Hubs.

You should not recommend Azure Data Factory. With Data Factory, you can perform big data analytics using data-driven pipelines. Azure Data Factory orchestrates Extract, Transform, Load (ETL) / Extract, Load, Transform (ELT) and can invoke ML pipelines, but Azure Databricks is the better fit for interactive, real-time analytics and ML compute at scale.

You should not recommend Azure Stream Analytics, since it is a real-time processing engine. It can collect data from multiple sources and provide quick insights. It can store these insights in multiple data storages. However, it cannot train machine-learning models, which are required for recommending the products in the online store.

**Reference:** [Microsoft Learn](https://learn.microsoft.com/en-us/azure/databricks/scenarios/what-is-azure-databricks)


---

### Question 83
**Domain:** Design Data Storage Solutions
**Subdomain:** Design non-relational data storage solutions
**Type:** Multiple Choice

#### Question
A company is planning to use Azure Blob storage for a web application which is hosted on an Azure VM.

The data consists of several hundred files that are 1 GB or larger in size. The data is frequently accessed and staged for processing.

You need to provide a solution that minimizes the costs of data access.

Which access tier should you recommend?

#### Options
A. Hot
B. Archive
C. Cool

#### Correct Answer
**Hot**

#### Explanation
You should recommend the Hot access tier because it is expected to be accessed frequently for both read and write operations. For this storage tier, the cost is higher for the storage and lower for the access methods. This meets the requirement of low access costs.

You should not recommend the Cool access tier because it is designed for storing data that is infrequently accessed and stored for at least 30 days. Access costs per GB/transaction are higher in the Cool tier than in the Hot tier.

You should not recommend the Archive access tier because it is designed for storing data that is rarely accessed and stored for at least 180 days with flexible latency requirements (requires hours to rehydrate). Access costs and retrieval fees are the highest in the Archive tier.

**Reference:** [Microsoft Learn](https://learn.microsoft.com/en-us/azure/storage/blobs/access-tiers-overview)


---

### Question 84
**Domain:** Design Data Storage Solutions
**Subdomain:** Design non-relational data storage solutions
**Type:** Multiple Choice

#### Question
You are working on a project that involves migrating on-premises semi-structured and unstructured data to Azure Storage. Management has stipulated that all migrated data must be highly resilient to power, network, or other hardware-related outages. Specifically, your solution must ensure that:

* Data stored must be replicated across three availability zones.
* Data must be available even if a zone becomes unavailable for any reason.
* Data must be protected from regional disasters that may impact more than one zone.
* Data stored in the secondary region must be redundantly stored across three copies.

You recommend that redundant storage should be used to meet these requirements.

Which redundancy option should you include in your design?

#### Options
A. Geo-redundant storage (GRS)
B. Locally-redundant storage (LRS)
C. Zone-redundant storage (ZRS)
D. Geo-zone-redundant storage (GZRS)

#### Correct Answer
**Geo-zone-redundant storage (GZRS)**

#### Explanation
Geo-zone-redundant storage (GZRS) copies your data synchronously across three availability zones in the primary region using Zone-redundant storage (ZRS), which meets the first two requirements, and then copies it asynchronously to the paired secondary region, where three copies are stored using Locally-redundant storage (LRS), which meets the third and fourth requirements.

ZRS replicates only across the three availability zones of the primary region and has no secondary region, so it cannot protect the data from a regional disaster.

Geo-redundant storage (GRS) replicates with LRS within a single location in each region, so it does not spread the primary copies across availability zones.

LRS keeps all three copies in one datacenter in the primary region.

**Reference:** [Microsoft Learn](https://learn.microsoft.com/en-us/azure/storage/common/storage-redundancy#geo-zone-redundant-storage)


---

### Question 85
**Domain:** Design Data Storage Solutions
**Subdomain:** Design data security and encryption solutions
**Type:** Yes/No Statements Table

#### Question
Your Azure environment includes an Azure SQL Managed Instance that hosts a single database. The database includes data columns that contain especially sensitive data. Access to this data must be strictly controlled, including limiting access to administrators and other privileged users.

You are investigating the use of the Always Encrypted feature to provide additional protection.

You need to identify the features and functionality of Always Encrypted.

For each of the following statements, select Yes if the statement is true. Otherwise, select No.

#### Statements Evaluation
- **Statement:** Always Encrypted encryption keys are never exposed to the SQL Managed Instance and are stored in an Azure Key Vault only.
  - **Answer:** `No`
  - **Rationale:** Always Encrypted encryption keys are never exposed to the SQL Managed Instance. However, encryption keys can be stored in Azure Key Vault or in Windows Certificate Store (or hardware security modules / managed HSMs), not exclusively in Azure Key Vault.
- **Statement:** Always Encrypted can be used to prevent cloud admins and db_owners from viewing protected data.
  - **Answer:** `Yes`
  - **Rationale:** Always Encrypted can be used to prevent cloud admins and db_owners from viewing protected data. Preventing access to the data by privileged users is a primary reason for implementing Always Encrypted.
- **Statement:** Always Encrypted encrypts data at rest, in memory, and in use for protected columns.
  - **Answer:** `Yes`
  - **Rationale:** Always Encrypted encrypts data client-side, so values in protected columns remain encrypted at rest, in transit, and in the memory of the Database Engine, and even a DBA cannot read the plaintext.
- **Statement:** Always Encrypted allows you to identify sensitive data columns before deploying a production database.
  - **Answer:** `No`
  - **Rationale:** Always Encrypted does not identify sensitive columns. Discovering and classifying sensitive columns is the role of SQL Data Discovery and Classification, which then recommends Always Encrypted or Dynamic Data Masking.

#### Explanation
Always Encrypted encryption keys are never exposed to the SQL Managed Instance. However, encryption keys can be stored in Azure Key Vault or in Windows Certificate Store. Microsoft recommends using Azure Key Vault for key storage because this makes it easier to manage the encryption keys.

Always Encrypted can be used to prevent cloud admins and db_owners from viewing protected data. Preventing access to the data by privileged users is a primary reason for implementing Always Encrypted. This includes administrators, cloud admins, and privileged database users.

Always Encrypted encrypts data client-side, so values in protected columns remain encrypted at rest, in transit, and in the memory of the Database Engine, and even a DBA cannot read the plaintext. It does not replace Transparent Data Encryption (TDE), which encrypts the whole database at rest on the server, or Transport Layer Security (TLS), which protects the connection. Instead, it supplements them for your most sensitive columns.

Always Encrypted does not identify sensitive columns. It protects columns that you have already identified: you configure encryption for specific columns, choosing the encryption type and keys. Discovering and classifying sensitive columns is the role of SQL Data Discovery and Classification, which then recommends Always Encrypted or Dynamic Data Masking for the columns it flags.

**Reference:** [Microsoft Learn](https://learn.microsoft.com/en-us/azure/azure-sql/database/always-encrypted-azure-sql-database)


---

### Question 86
**Domain:** Design Data Storage Solutions
**Subdomain:** Design non-relational data storage solutions
**Type:** Multiple Choice

#### Question
Your company currently sends all Azure log data to a Log Analytics workspace. The company plans to configure an event hub to also send the data to blob storage for long-term storage and trend analysis. Data will be maintained for at least 180 days.

The analysis will compare legacy data with current activity log data periodically. Access latency to the stored data and storage costs should be minimized. The solution should support zone-redundant storage (ZRS). You plan to create a new storage account to hold the log data.

You need to determine the type of storage account that you should create.

What type of storage account should you create?

#### Options
A. FileStorage
B. General-purpose v2
C. BlockBlobStorage
D. General-purpose v1

#### Correct Answer
**General-purpose v2**

#### Explanation
You should create a General-purpose v2 storage account. This account type supports blob storage and lets you choose an access tier. In this scenario, you would choose a cool storage tier to meet the access latency requirement while minimizing costs. General-purpose v2 storage accounts support zone-redundant storage (ZRS).

You should not create a General-purpose v1 account. This account type does not support access tiers nor does it support ZRS.

You should not create a BlockBlobStorage account. This account type does not support access tiers. It is not the most cost-effective solution because it only uses the premium storage tier.

You should not create a FileStorage account. A FileStorage account does not support blob storage.

**Reference:** [Microsoft Learn](https://learn.microsoft.com/en-us/azure/storage/common/storage-account-overview)


---

### Question 87
**Domain:** Design Data Storage Solutions
**Subdomain:** Design non-relational data storage solutions
**Type:** Multiple Choice

#### Question
Your company is identifying requirements and preparing implementation designs for moving most of its resources from on-premises to Azure. These requirements include several storage scenarios with various size, performance, access, and long-term storage requirements. You are focused on matching storage account types to appropriate storage requirements.

You need to identify which type of Azure storage account supports blob access tiers.

Which storage account type should you include?

#### Options
A. Premium block blobs
B. Standard general-purpose v2
C. Premium page blobs
D. Premium file shares

#### Correct Answer
**Standard general-purpose v2**

#### Explanation
You should include a standard general-purpose v2 storage account. It is the only account type that supports blob access tiers, and it supports all four: hot, cool, cold, and archive. Microsoft recommends general-purpose v2 accounts for most storage scenarios, which suits a company matching several different storage requirements to account types.

You should not include a premium block blobs account. Although it stores block blobs, it is a premium performance account: data stored in a premium block blob storage account cannot be tiered to hot, cool, cold, or archive by using Set Blob Tier or Azure Blob Storage lifecycle management.

You should not include a premium file shares account. This account type supports Azure Files only. It holds no blobs, so blob access tiers do not apply to it.

You should not include a premium page blobs account. Access tiers can be set on block blobs only; they are not supported for append blobs or page blobs.

**Reference:** [Microsoft Learn](https://learn.microsoft.com/en-us/azure/storage/common/storage-account-overview)


---

### Question 88
**Domain:** Design Data Storage Solutions
**Subdomain:** Design data integration and ingestion solutions
**Type:** Multiple Choice

#### Question
Your company is planning a merger with another company of a similar size. The other company has an on-premises data infrastructure that consists of proprietary databases, XML files, and PDF files of scanned documents. The merger is about to happen soon, and you need a way to quickly place this data in the cloud for analysis.

You need to choose an appropriate data flow and storage solution.

What should you do?

#### Options
A. Use Data Factory to copy the data from the other company and store it in Data Lake.
B. Use HDInsight to copy the data from the other company and store it in Data Factory.
C. Use Data Lake to copy the data from the other company and store it in HDInsight.
D. Use Data Factory to copy the data from the other company and store it in Azure SQL Database.

#### Correct Answer
**Use Data Factory to copy the data from the other company and store it in Data Lake.**

#### Explanation
You should use Data Factory to copy the data from the other company and store it in Data Lake. Data Factory is a data integration service that allows you to create workflows for transforming and moving data. In this scenario, the data needs to be moved from the other company to Azure Data Lake. Data Lake is a hyper-scale repository for big data workloads. It allows you to capture data of any size and type (relational, semi-structured XML, and unstructured PDF files), which is ideal in this scenario.

You should not use HDInsight to copy the data from the other company and store it in Data Factory. HDInsight is a big data solution that makes it easy to process large amounts of data. It is typically used for batch processing, data warehousing, data science, and streaming of Internet-of-Things (IoT) devices. Also, data cannot be stored in Data Factory. Data Factory is a workflow service.

You should not use Data Factory to copy the data from the other company and store it in Azure SQL Database. Azure SQL Database is a Platform-as-a-Service (PaaS) offering of Microsoft SQL Server, which is a relational database engine. It is not ideal in this scenario because you need to store data of varying types that is not all relational (such as XML and scanned PDF files).

You should not use Data Lake to copy the data from the other company and store it in HDInsight. Data Lake stores data. It cannot copy data.

**Reference:** [Microsoft Learn](https://learn.microsoft.com/en-us/azure/data-factory/introduction)


---

### Question 89
**Domain:** Design Data Storage Solutions
**Subdomain:** Design data security and encryption solutions
**Type:** Yes/No Statements Table

#### Question
You are designing the protection of a relational database in Azure SQL Database that holds payroll data. The design must keep the plaintext of two salary columns out of reach of anyone who administers the database or the platform.

You are evaluating Always Encrypted for those two columns.

For each of the following statements about Always Encrypted, select Yes if the statement is true. Otherwise, select No.

#### Statements Evaluation
- **Statement:** A user with the db_owner role on the database can read the plaintext of an Always Encrypted column.
  - **Answer:** `No`
  - **Rationale:** A user with the db_owner role on the database cannot read the plaintext of an Always Encrypted column. Encryption and decryption occur in the client driver, and the Database Engine stores and processes encrypted values. Database administrators and platform administrators see only ciphertext unless they also have access to the encryption keys through an authorized client application.
- **Statement:** Without server-side secure enclaves, a range predicate such as greater than cannot be evaluated on an Always Encrypted column.
  - **Answer:** `Yes`
  - **Rationale:** Without server-side secure enclaves, a range predicate such as greater than cannot be evaluated on an Always Encrypted column. Always Encrypted without secure enclaves supports equality comparisons only on deterministically encrypted columns. Range comparisons and other rich query operations require secure enclave support.
- **Statement:** The column master key is stored in the database alongside the encrypted data.
  - **Answer:** `No`
  - **Rationale:** The column master key is not stored in the database alongside the encrypted data. The database stores metadata about the column master key and encrypted column encryption keys. The column master key is stored outside the database in a trusted key store such as Azure Key Vault or the Windows certificate store.

#### Explanation
A user with the db_owner role on the database cannot read the plaintext of an Always Encrypted column. Encryption and decryption occur in the client driver, and the Database Engine stores and processes encrypted values. Database administrators and platform administrators see only ciphertext unless they also have access to the encryption keys through an authorized client application.

Without server-side secure enclaves, a range predicate such as greater than cannot be evaluated on an Always Encrypted column. Always Encrypted without secure enclaves supports equality comparisons only on deterministically encrypted columns. Range comparisons and other rich query operations require secure enclave support.

The column master key is not stored in the database alongside the encrypted data. The database stores metadata about the column master key and encrypted column encryption keys. The column master key is stored outside the database in a trusted key store such as Azure Key Vault or the Windows certificate store.

**Reference:** [Microsoft Learn](https://learn.microsoft.com/en-us/azure/azure-sql/database/always-encrypted-azure-sql-database)


---

### Question 90
**Domain:** Design Data Storage Solutions
**Subdomain:** Design non-relational data storage solutions
**Type:** Dropdown / Matching

#### Question
You are designing a mission-critical web app that will process large amounts of data from clients located around the world. You have selected Microsoft Azure as your platform of choice, but you need to finalize the design of a backend database that minimizes read latency for clients worldwide. All writes will be issued from a single Azure region, and the data will be replicated to read regions close to your clients. Your solution must meet the following requirements:

* Client requests must always return the most recent committed version of the data.
* Read requests must be served with linearizable guarantees.
* Read latency minimization must be backed by a service-level agreement (SLA).
* The service must offer an SLA of 99.999% read availability.

Which database service and consistency level should you include in your design? To answer, select the appropriate options from the drop-down menus.

#### Dropdown Selections
- **Database service** ➔ `Azure Cosmos DB`
- **Consistency level** ➔ `Strong consistency`

#### Explanation
You should include the Azure Cosmos DB database service in your design. Azure Cosmos DB is purpose-built for Azure and is designed to provide practically limitless storage at a massive scale. This performance and scalability is supported by service-level agreement (SLA) guarantees that outline 99.999% read availability and read latencies of less than 10 milliseconds. Cosmos DB can support both relational and non-relational data models, including open-source PostgreSQL, Apache Cassandra, and MongoDB.

You should recommend that the Azure Cosmos DB consistency level be set to strong consistency. Consistency levels are used to define how effectively a database engine can return data that is the most up to date. For example, in a real-world scenario involving a geographically distributed database, consistency levels would define how quickly a request written to an instance in Asia would be available for retrieval by a client in South America. Azure Cosmos DB supports five consistency levels, with the strong consistency level guaranteeing that all reads will return the most recently committed write and providing the linearizability guarantee required by this scenario. Azure Cosmos DB offers a 99.999% read availability SLA for any account that spans two or more regions, regardless of the consistency level configured. A 99.999% write availability SLA would instead require an account configured with multi-region writes, and strong consistency is not supported on multi-region write accounts. For this reason, the design uses a single write region with multiple read regions.

You should not recommend the Azure Database for MySQL or Azure SQL Database services. While both platforms offer solid performance, they are primarily designed to store structured data using tables, which are comparable to spreadsheets, that can be queried using Structured Query Language (SQL). Neither offers SLA-backed latency minimization or 99.999% uptime guarantees.

You should not recommend the session or bounded staleness consistency levels. As the name indicates, session consistency ensures that data is read-consistent for the writer, meaning the writer will see the latest version of data they have written, while other readers may not always see the latest data. Bounded staleness offers better read consistency than session consistency but can still suffer from lag, especially if data is being stored across multiple regions.

**Reference:** [Microsoft Learn](https://learn.microsoft.com/en-us/azure/cosmos-db/consistency-levels)


---

### Question 91
**Domain:** Design Data Storage Solutions
**Subdomain:** Design relational data storage solutions
**Type:** Drag and Drop / Matching

#### Question
You are planning a new VM that will run a SQL Server instance. You identify the following requirements:

* A database named DB1 must support up to 15000 input/output operations per second (IOPS) and it requires 1 TB of disk space.
* The tempdb database requires 10 GB of disk space.
* DB1 and tempdb need to be hosted on different disks.

You need to specify the disk type for each database. The solution must support the smallest possible VM and must minimize costs.

Which disk type should you specify for each database? To answer, drag the appropriate disk type to each database. A disk type may be used once, more than once, or not at all.

#### Matching Pairs
- **DB1** ➔ `Premium SSD`
- **tempdb** ➔ `Local storage`

#### Available Options / Distractors
- Premium SSD
- Local storage
- Standard HDD
- Standard SSD
- Ultra disk

#### Explanation
You should specify Premium SSD for DB1 because it is the only option that supports more than 15000 IOPS and fulfills the requirements of minimizing the VM size and costs.

You should specify local storage for tempdb because this is the fastest available storage, and it has no cost. The downside of using local storage is that the data would not be persisted if the VM restarted, which is not a problem for tempdb.

You should not specify Standard HDD or Standard SSD disks because they do not meet the performance requirements.

You should not specify Ultra SSD disks because they are more expensive than Premium storage.

**Reference:** [Microsoft Learn](https://learn.microsoft.com/en-us/azure/azure-sql/virtual-machines/windows/performance-guidelines-best-practices-storage)


---

### Question 92
**Domain:** Design Data Storage Solutions
**Subdomain:** Design relational data storage solutions
**Type:** Multiple Choice

#### Question
You have several general purpose Azure SQL databases that have capacities of 400 database transaction units (DTUs) each. These databases have varying and unpredictable usage demands. Half of the databases use less than 200 DTUs on a regular basis.

You need to optimize the cost of managing and scaling the databases.

Which solution should you recommend?

#### Options
A. Elastic pools
B. Standard service tier
C. Hyperscale service tier
D. v-Core based model

#### Correct Answer
**Elastic pools**

#### Explanation
You should recommend elastic pools because they are a cost-effective solution to manage and scale multiple databases that have varying and unpredictable usage demands. The databases will share the resources at a set price. They must be on the same server.

You should not recommend the Hyperscale service tier because you will not be able to control how the resources are managed by each of the databases. The Hyperscale service tier is a highly scalable storage and compute performance tier.

You should not recommend the Standard/General Purpose service tier because you will not be able to control how the resources are managed by each of the databases. This tier is a default service tier in Azure SQL Database that is designed for generic workloads.

You should not recommend the v-Core based model because you will not be able to control how the resources are managed by each of the databases. The vCore-based purchasing model enables you to independently scale compute and storage resources, match on-premises performance, and optimize price, but alone it does not provide shared pooling across fluctuating databases.

**Reference:** [Microsoft Learn](https://learn.microsoft.com/en-us/azure/azure-sql/database/elastic-pool-overview)


---

### Question 93
**Domain:** Design Data Storage Solutions
**Subdomain:** Design data warehousing and query optimization
**Type:** Multiple Choice

#### Question
Your company uses Azure Synapse Analytics to support artificial intelligence (AI) development projects. As part of its data analysis work, the AI engineering team frequently executes complex queries. These queries join and aggregate data from multiple tables. However, the AI engineers complain that as their data sets continue to grow on a daily basis, query performance has started to degrade.

You need to recommend a solution that will use caching to reduce the execution time for these queries.

What should you recommend?

#### Options
A. Materialized views
B. Serverless SQL pool
C. PolyBase integration
D. Result set caching

#### Correct Answer
**Materialized views**

#### Explanation
You should recommend materialized views. In essence, a view is a named Structured Query Language (SQL) statement that you can query and join like a table. Unlike a table, however, when a view is called, the underlying query is executed and the results tabulated. This process requires additional processing time. On the other hand, a materialized view is executed, and the results are stored in the database, just like a table. The result is that queries that reference the view run faster.

You should not recommend a serverless SQL pool. Serverless SQL pool is a cloud-based Azure service that provides SQL server capabilities without requiring the underlying infrastructure. Every Azure Synapse Analytics workspace includes a default serverless SQL pool you can use to query the data you use in Synapse Analytics.

You should not recommend result set caching. This feature is offered by dedicated SQL pools, but it is designed for relatively static data. In this scenario, the base tables being queried are growing on a daily basis.

You should not recommend PolyBase integration. PolyBase is used to integrate external data with Azure Synapse Analytics. It is not used to cache query results or improve query performance.

**Reference:** [Microsoft Learn](https://learn.microsoft.com/en-us/azure/synapse-analytics/sql-data-warehouse/performance-tuning-materialized-views)


---

### Question 94
**Domain:** Design Data Storage Solutions
**Subdomain:** Design relational data storage solutions
**Type:** Multiple Choice

#### Question
Your company is developing a new data-intensive application. The initial database will contain approximately 1 TB of data. After the production version of the database is released, it is projected to grow by 300 to 500 GB per year.

All development will take place in Azure.

You need to recommend an Azure database solution that meets the following requirements:

* Microsoft SQL Server compatibility
* Minimal management requirements
* Minimal cost
* Support for DTU-based purchasing model
* Support for widely varying processing requirements during development

Which storage solution should you recommend?

#### Options
A. Azure SQL managed instance
B. Azure SQL Database elastic pool
C. Azure SQL Database single database
D. SQL Server on Azure VM

#### Correct Answer
**Azure SQL Database single database**

#### Explanation
You should recommend an Azure SQL Database single database. This database solution meets all the scenario requirements. However, if required, in future, with the growth of the database that is 300-500GB per year, an additional database can be added to accommodate the needed capacity and the databases can be added to an elastic pool.

You should not recommend Azure SQL Database elastic pool. This is used when you have multiple databases with different user requirements and peak use periods to provide cost savings by having the database share resources. In this scenario, a single database that does not need an Azure SQL Database elastic pool is needed.

You should not recommend Azure SQL managed instance. Managed instance meets most of the scenario requirements but does not support a DTU-based pricing model. Pricing support is for vCore only.

You should not recommend SQL Server on Azure VM. This option has the greatest compatibility with the SQL Server but it also has the highest management overhead. This is because you are responsible for managing the operating system and database engine.

**Reference:** [Microsoft Learn](https://learn.microsoft.com/en-us/azure/azure-sql/database/single-database-overview)


---

### Question 95
**Domain:** Design Data Storage Solutions
**Subdomain:** Design non-relational data storage solutions
**Type:** Multiple Choice

#### Question
You have an Azure Blob storage account containing data accessed several times daily.

You plan to upload a new blob to the Blob storage account. The data in this specific new blob will be viewed infrequently but must be available immediately when accessed.

You must configure the access tier for the new blob. The solution must minimize storage costs.

What should you do?

#### Options
A. Set the access tier for the new blob to Archive.
B. Set the default access tier for the storage account to Cool.
C. Set the default access tier for the storage account to Hot.
D. Set the access tier for the new blob to Cool.

#### Correct Answer
**Set the access tier for the new blob to Cool.**

#### Explanation
You should set the access tier for the new blob to Cool. Cool storage is intended for data accessed infrequently and stored for 30 days or more. Cool storage has a similar time-to-access as Hot data. Although it has a slightly lower availability compared to Hot data, storage costs are lower.

You should not set the access tier for the new blob to Archive. Although Archive storage is the least expensive, it also has several hours of retrieval latency.

You should not set the default access tier for the account to Hot. Usually, the blobs in the storage account are accessed frequently. If the tier for the account is set to Hot, this applies to the new blob as well.

You should not set the default access tier for the account to Cool. The Cool access tier is appropriate specifically for the new blob only. If the default tier for the account is set to Cool, this applies to the next uploaded blobs as well, and these blobs might need to be frequently accessed.

**Reference:** [Microsoft Learn](https://learn.microsoft.com/en-us/azure/storage/blobs/access-tiers-overview)


---

### Question 96
**Domain:** Design Data Storage Solutions
**Subdomain:** Design non-relational data storage solutions
**Type:** Yes/No Statements Table

#### Question
You are the cloud architect for a newly founded manufacturing company that has built out the entirety of its IT infrastructure in Azure. You are reviewing the company's core business IT systems to identify its data archiving needs.

Due to financial regulations, the accounting system's database backups need to be retained for 10 years in the event of a historical audit. If needed, these backups must be retrieved within one day after the request for a file is received.

The order tracking system has a database that tracks order details and associated materials. The system also generates PDF files of the final build sheets for the company's work. The company must keep the database backups for three months, at which point the backups can be deleted. If needed, database backup of the order tracking system must be available immediately. The generated PDFs must be kept indefinitely with minimal costs and have no retrieval time requirement.

You need to identify if the Azure storage archive tier meets the requirements for the long-term storage of each IT system.

For each of the following statements, select Yes if the statement is true. Otherwise, select No.

#### Statements Evaluation
- **Statement:** The accounting system backups can be stored as block blobs in the Archive access tier.
  - **Answer:** `Yes`
  - **Rationale:** The accounting system backups can be stored as block blobs in the Archive access tier. This is the least expensive option for files that will be kept for at least 180 days. Blobs in the archive tier cannot be accessed immediately, because rehydration to an online tier can take up to 15 hours. However, this is less than one day, which is the maximum retrieval time for the backups in this scenario.
- **Statement:** The order tracking system PDF files can be stored as block blobs in the Archive access tier.
  - **Answer:** `Yes`
  - **Rationale:** The order tracking system PDF files can be stored as block blobs in the Archive access tier. The files will be kept indefinitely (which is more than 180 days) and the archive tier has the minimum storage cost. The requirement for immediate availability applies only to the order tracking system database backups; no retrieval time requirement is specified for the PDF files.
- **Statement:** The order tracking system database backups can be stored as block blobs in the Archive access tier.
  - **Answer:** `No`
  - **Rationale:** The order tracking system database backups cannot be stored as block blobs in the Archive access tier. Because the backups must be available immediately when needed. Blobs in the archive tier cannot be accessed immediately, because rehydration to an online tier can take up to 15 hours. In addition, the backups are deleted after 3 months, which would incur early deletion penalty fees in the Archive tier (180 days minimum).

#### Explanation
The archive access tier is set at the blob level, either when a blob is uploaded, by using the Set Blob Tier operation, or through a lifecycle management policy. The default access tier of a storage account can be set only to hot, cool, or cold.

The accounting system backups can be stored as block blobs in the Archive access tier. This is the least expensive option for files that will be kept for at least 180 days. Blobs in the archive tier cannot be accessed immediately, because rehydration to an online tier can take up to 15 hours. However, this is less than one day, which is the maximum retrieval time for the backups in this scenario.

The order tracking system PDF files can be stored as block blobs in the Archive access tier. The files will be kept indefinitely (which is more than 180 days) and the archive tier has the minimum storage cost. The requirement for immediate availability applies only to the order tracking system database backups; no retrieval time requirement is specified for the PDF files.

The order tracking system database backups cannot be stored as block blobs in the Archive access tier. Because the backups must be available immediately when needed. Blobs in the archive tier cannot be accessed immediately, because rehydration to an online tier can take up to 15 hours.

**Reference:** [Microsoft Learn](https://learn.microsoft.com/en-us/azure/storage/blobs/access-tiers-overview)


---

### Question 97
**Domain:** Design Data Storage Solutions
**Subdomain:** Design storage security and access control
**Type:** Multiple Choice

#### Question
You plan to use a blob storage account that allows four partners to access technical videos. The partners do not have accounts in your company's Microsoft Entra tenant. The partners should not be able to modify the storage account.

You need to design a strategy to allow secure access to the videos.

What should you do?

#### Options
A. Provide the primary access key.
B. Provide the secondary access key.
C. Create a shared access signature (SAS).
D. Create a role assignment.

#### Correct Answer
**Create a shared access signature (SAS).**

#### Explanation
You should create a shared access signature (SAS). This is a URL that contains the path to a resource, as well as a token. The token describes how a resource can be accessed by a client. In this scenario, you need to create four SAS; one for each partner, as this will ensure that each partner has permission to access its own blob container and not others.

You should not create a role assignment. Role assignments are accomplished with role-based access control (RBAC). RBAC controls which users or groups have access to resources, and which permissions they have on those resources. This requires users to be members of a Microsoft Entra tenant. In this scenario, the partners are not members of the Microsoft Entra tenant.

You should not provide the primary or secondary access keys. Both of these keys are used for administrative access to blob storage. In this scenario, you do not want to allow the partners to modify the storage account.

**Reference:** [Microsoft Learn](https://learn.microsoft.com/en-us/azure/storage/common/storage-sas-overview)


---

### Question 98
**Domain:** Design Data Storage Solutions
**Subdomain:** Design relational data storage solutions
**Type:** Multiple Select

#### Question
You are designing an Azure SQL deployment to support two business intelligence applications, App1 and App2. The App1 database must be hosted using a serverless compute service and support databases up to 100 TB in size. The App2 database must use a dedicated database engine and support the ability to move into or out of an elastic pool.

Your solution must minimize management overhead and optimize cost.

Which two options should you include in your design? Each correct answer presents part of the solution.

#### Options
A. Use SQL Server on an Azure Virtual Machine for App2.
B. Use the single database resource type for App2.
C. Use an instance pool for App1.
D. Use the Hyperscale service tier for App1.
E. Use the single instance feature for App2.

#### Correct Answer
- **Use the single database resource type for App2.**
- **Use the Hyperscale service tier for App1.**

#### Explanation
You should use the Hyperscale service tier for App1 and the single database resource type for App2. The Azure Structured Query Language (SQL) Database platform provides three products as part of its SQL Server-based offerings: Azure SQL Database, Azure SQL Managed Instance, and SQL Server on Azure Virtual Machines (VMs). The Azure SQL Database single database service provides serverless compute and, when coupled with the Hyperscale service tier, supports databases up to 100TB in size. Databases created using the single database approach can also move into or out of elastic pools. This allows you to enhance database scalability while also optimizing costs.

You should not use the single instance feature for App2. Single instance is a feature of the SQL Managed Instance product and is the most commonly used Azure SQL product. While SQL Managed Instance supports most of the features included in SQL Server, it does not meet the requirements stated in the scenario, including serverless compute or elastic pools.

You should not use SQL Server on an Azure Virtual Machine for App2. This product is used to provide a native, Windows-based SQL Server environment. Like SQL Managed Instance, this approach does not support serverless compute or elastic pools.

You should not use an instance pool for App1. An instance pool can be used to pre-provision SQL resources, which can help to optimize costs. However, instance pools are part of the SQL Managed Instance product and do not support serverless compute or elastic pools.

**Reference:** [Microsoft Learn](https://learn.microsoft.com/en-us/azure/azure-sql/database/service-tier-hyperscale)


---

### Question 99
**Domain:** Design Data Storage Solutions
**Subdomain:** Design storage security and access control
**Type:** Yes/No Statements Table

#### Question
You have been assigned a project that includes increasing the protection of files and blobs that store sensitive information. You have decided to use shared access signatures (SAS) with your Azure storage account to complete this task. Your design stipulates that your organization will implement account-level SAS. As part of this configuration, you have specified that access will only be allowed using approved protocols. Additionally, each access grant will be scoped with an expiration date that is based on the sensitivity of the data stored in the target location.

For each of the following statements, select Yes if the statement is true. Otherwise, select No.

#### Statements Evaluation
- **Statement:** For each SAS, you should limit access to applications using secure protocols such as HTTPS and SSH.
  - **Answer:** `No`
  - **Rationale:** SSH is not a supported protocol option for Azure Storage SAS. SAS only supports HTTPS or HTTPS and HTTP.
- **Statement:** For each SAS, you should configure file and blob access in the same signature.
  - **Answer:** `Yes`
  - **Rationale:** An account-level SAS can be generated to protect any combination of services (Blob, File, Queue, Table) in a single signature token.
- **Statement:** For each SAS, you should specify an expiration date and time zone-specific time.
  - **Answer:** `Yes`
  - **Rationale:** Specifying start and expiry timestamps prevents indefinite access and automatically closes access windows according to data sensitivity.

#### Explanation
For each shared access signature (SAS), you should not limit access to applications using secure protocols such as Hypertext Transfer Protocol Secure (HTTPS) and Secure Shell (SSH). An SAS provides you with two protocol options: you can restrict access to HTTPS only, or to HTTPS and Hypertext Transfer Protocol (HTTP). HTTP was the primary protocol used on the internet for several decades. However, most modern browsers and websites primary use HTTPS as this provides data confidentiality. SSH, like HTTPS, also encrypts data as it traverses a network. However, SSH is not supported as a configured SAS protocol.

A SAS allows you to implement granular security controls for Azure Storage resources including files, blobs, tables, and other storage constructs. When an SAS is defined, a Uniform Resource Identifier (URI) is created and is associated with the permissions, expiry, and other restrictions you have configured for the SAS. You can then share this URI with internal and external users without compromising the keys associated with your storage account.

For each SAS, you should configure file and blob access in the same signature. An account SAS can be created to protect any combination of files, blobs, tables, or queues.

For each SAS, you should specify an expiration date and time zone-specific time. This allows you to limit access to a specific timeframe and negates the need to manually disable access to a storage resource in the future.

**Reference:** [Microsoft Learn](https://learn.microsoft.com/en-us/azure/storage/common/storage-sas-overview)


---

### Question 100
**Domain:** Design Data Storage Solutions
**Subdomain:** Design data security and encryption solutions
**Type:** Multiple Choice

#### Question
Your enterprise stores business data in an Azure SQL Managed Instance.

A compliance review requires that the enterprise, and not Microsoft, controls the key that protects the data at rest. The enterprise must be able to rotate the key on its own schedule, and revoking access to the key must prevent access to the encrypted data.

The entire database must remain protected, and the applications that query the database must not be modified.

You need to recommend a data protection solution.

What should you recommend?

#### Options
A. Always Encrypted with a column master key
B. Transparent Data Encryption (TDE) with a customer-managed key
C. Dynamic Data Masking on sensitive columns
D. Transparent Data Encryption (TDE) with a service-managed key

#### Correct Answer
**Transparent Data Encryption (TDE) with a customer-managed key**

#### Explanation
You should recommend Transparent Data Encryption (TDE) with a customer-managed key in Azure Key Vault. Customer-managed TDE enables the company to control the key lifecycle, including key rotation and key access. The TDE protector is stored in Azure Key Vault, and revoking the managed instance's access to the key prevents access to the encrypted data. TDE protects the entire database, including backups and transaction logs, and does not require application changes.

You should not recommend Transparent Data Encryption (TDE) with a service-managed key. Although it encrypts data at rest for the entire database, Microsoft owns and manages the encryption key. The company cannot control key rotation or revoke access to the key.

You should not recommend Always Encrypted with a column master key. Always Encrypted protects only designated columns rather than the entire database. In addition, encryption and decryption occur through the client driver, making it unsuitable for the requirement to protect the entire database transparently.

You should not recommend Dynamic Data Masking on sensitive columns. Dynamic Data Masking hides the sensitive data in the result set of a query for selected users, but the data in the database is not changed. It therefore does not encrypt stored data and does not provide protection for data at rest.

**Reference:** [Microsoft Learn](https://learn.microsoft.com/en-us/azure/azure-sql/database/transparent-data-encryption-byok-overview)


---

### Question 101
**Domain:** Design Data Storage Solutions
**Subdomain:** Design data security and encryption solutions
**Type:** Multiple Choice

#### Question
Your company has a hybrid network with an on-premises Active Directory (AD) and Microsoft Entra ID. A database server named DB1 is being migrated from an on-premises SQL Server to an Azure SQL Database.

You need to ensure that data in transit between on-premises users and the SQL Database is encrypted. The negative impact on database and communication performance should be kept to a minimum.

What should you recommend to meet the requirement?

#### Options
A. Always Encrypted
B. Dynamic data masking
C. Transparent Data Encryption (TDE)
D. Transport Layer Security (TLS)

#### Correct Answer
**Transport Layer Security (TLS)**

#### Explanation
You should recommend the Transport Layer Security (TLS) protocol to protect data in transit. Data is encrypted when transmitted either way between the database and the client. TLS provides strong authentication, message privacy, and data integrity controls. It is relatively easy to deploy and implement.

You should not recommend the Transparent Data Encryption (TDE) feature to secure data in transit. TDE is used to protect data at rest from unauthorized or offline access to the data. Data in the database and data backups are encrypted. TDE is enabled by default when you create a new Azure SQL Database or Azure SQL Managed Instance.

You should not recommend Always Encrypted. Always Encrypted provides a higher level of protection for data in your database and can be applied to individual columns within the database. Data is encrypted at rest, in memory, and in use. It is used when you need added protection such as protecting the data from access by database administrators or other privileged users. Always Encrypted is not meant for use as a substitute for TLS or TDE, and incurs significant processing overhead. It is designed for use as a supplement to TLS and TDE for especially sensitive data.

You should not recommend Dynamic data masking. This is used as a way to ensure that only a select portion of the data in a data column is displayed in clear text; for example, only the last four digits of a telephone number.

**Reference:** [Microsoft Learn](https://learn.microsoft.com/en-us/azure/azure-sql/database/connect-query-content-reference-guide#tls-considerations-for-database-connectivity)


---

### Question 102
**Domain:** Design Data Storage Solutions
**Subdomain:** Design relational data storage solutions
**Type:** Multiple Choice

#### Question
A company is developing a multi-tenant Software-as-a-Service (SaaS) product on Azure. The product requires many databases per tenant.

You need to recommend a relational database solution that meets the following requirements:

* The solution must be cost-efficient.
* The team does not have a database administrator, so the management overhead of the database must be kept to a minimum.
* The database must support geo-replication and auto-failovers.

Which database solution should you recommend?

#### Options
A. SQL Server on Azure virtual machines
B. Azure SQL Managed Instance
C. An Azure SQL Database single database
D. An Azure SQL Database elastic pool

#### Correct Answer
**An Azure SQL Database elastic pool**

#### Explanation
You should recommend an Azure SQL Database elastic pool. Although the company delivers its own product as SaaS, the database service it runs on, Azure SQL Database, is a Platform-as-a-Service (PaaS) solution that is completely managed by Azure, so you do not have to perform any database administration work to manage the servers. This is cost-efficient as resources are being shared and there is no underutilization of resources. It also supports geo-replication and auto-failovers in the event of outages (via active geo-replication and failover groups).

You should not select an Azure SQL Database single database. This provides the same features as an elastic pool, but it is not as cost-efficient since you will be creating a single database for each service with dedicated provisioned compute. This means the cost of your database will increase significantly.

You should not select SQL Server on Azure virtual machines. This is an Infrastructure-as-a-Service (IaaS) solution where a SQL server is deployed on the virtual machine. This will require a database administrator who can manage the aspects of the server. You would need to replicate data by yourself and no automated failover options are available without manual setup.

You should not select Azure SQL Managed Instance. SQL Managed Instance is also a PaaS solution, but it provides more control on how the server is configured. To configure it correctly, you would need a database administrator, which will make it more costly than a SQL database elastic pool. It provides an automated backups feature, but no auto-failover capabilities without manual configuration of failover groups.

**Reference:** [Microsoft Learn](https://learn.microsoft.com/en-us/azure/azure-sql/database/saas-tenancy-app-design-patterns)


---

### Question 103
**Domain:** Design Data Storage Solutions
**Topic:** Case Study - CompanyA: Building Materials Cloud Modernization & Data Protection
**Type:** Case Study

#### Case Study: Case Study: CompanyA - Building Materials Cloud Modernization & Data Protection

##### Tab: Overview
CompanyA sells building materials online and in retail outlets around the world. CompanyA's IT infrastructure is hosted in on-premises data centers in multiple locations. The CEO and CTO realize the potential of Microsoft Azure Cloud to increase the company's competitive advantage and eliminate security concerns.

##### Tab: Existing environment
* CompanyA operates public websites serving its online shop.
* An online shop web application is connected to an SQL database server in the backend.
* The company's Azure SQL database server holds a 100GB product catalog and online order data. Rapid growth of the database size is not planned.
* The Active Directory (AD) authentication provider is in place. The AD domain name is companya.com.
* Marketing documents, media files, and product manuals are stored on file share servers on-premises at the head office's location.
* Marketing documents are accessed via mapped drives on Windows 10 clients.

##### Tab: Problem statement
* The SQL database server is not highly available. Every outage means a drop in sales and loss in customer confidence.
* The online shop website's performance on Black Friday is slow. The Azure SQL database has been identified as the bottleneck.
* Searching the site when viewing many items on the page is slow.
* There are security concerns regarding the possible loss of financial and personal data due to the potential unauthorized access by support personnel or administrators of the SQL database content.
* Content on file share servers includes not only current files, but also historical data. This historical data is rarely accessed and is needed only in the case of requests relating to legal and compliance matters. Due to legal requirements, the historical data will have to be kept for seven years. This data occupies additional storage and is costly to manage.
* Some remote locations have a slow internet connection and, therefore, access to marketing documents from remote locations is very slow.
* Privileges and rights granted to users and identities are not supervised.

##### Tab: Planned changes
* The online shop web servers will be migrated into Azure Cloud.
* The SQL database servers will be migrated into Azure Cloud with the least amount of effort.
* Data security practices will undergo modernization according to industry standard best practices.
* Marketing documents will be migrated from file share servers onto the cloud.
* A solution to reduce costs for historical data on file shares is to be implemented.

##### Tab: Technical and business requirements
* The SQL database must be highly available. Latency must be reduced.
* CompanyA requires a solution to obtain real-time business insights about customers' purchasing behavior by analyzing data collected from its own online shop's website, social media channels, and partner websites.

##### Tab: Security and policy requirements
* Legal regulations require customer data stored in Azure SQL Database to reside in the corresponding region of customer residence.
* All the data has to be secured at rest, in transit and in use.
* Compliance policy requires the retention of online order data for a minimum of seven years.
* Privileges and rights be granted to users and identities must be supervised.

#### Sub-Questions

##### Question 1 (Multiple Choice)
You need to recommend a storage design solution on the Azure Cloud platform for the marketing documents. Administrative effort and cost must be minimized.

What should you recommend?

**Options:**
A. Azure Files
B. Azure Queue Storage
C. Azure managed disks
D. Azure Blob Storage

**Correct Answer:** **Azure Files**

**Explanation:**
You should recommend Azure Files as a storage design solution for the marketing documents. Azure Files is a file share hosted on the Azure Cloud platform. Files hosted in Azure Files can be accessed via an industry-standard Server Message Block (SMB) protocol for file sharing. SMB allows applications to read and write to files in a computer network. Azure Files can be mapped as a shared drive on all main operating systems and thus can replace the company's on-premises file shares. In this scenario, marketing documents are accessed via mapped drives on Windows 10 clients, as such Azure Files is the best replacement solution.

You should not recommend Azure Blob Storage. Azure Blob Storage is an object-oriented storage solution. It is optimized to store unstructured data, such as large binary files, media files, log files, and backup files. Unlike Azure Files, Azure Blob Storage cannot be mapped as a shared drive, which is the main reason why, in this scenario, it is not the ideal storage solution for the marketing documents.

You should not recommend Azure managed disks. Azure managed disks are block-level storage volumes used by virtual machines to store data. Usually, you create Azure managed disks at the same time as a virtual machine.

You should not recommend Azure Queue Storage. Azure Queue Storage is a service to provide an interface for service-to-service communication. Azure Queue Storage can store a large amount of messages and can be accessed from anywhere using the HTTP or HTTPS protocols.

##### Question 2 (Multiple Select)
You are tasked with remediating the security concerns and implement data security requirements.

Which three encryption solutions should you include in your design? Each correct answer presents part of the solution.

**Options:**
A. SSL-Secure Sockets Layer/TLS - Transport Layer Security
B. Always Encrypted
C. Transparent Data Encryption (TDE)
D. Server-level firewall
E. Network security groups (NSGs)

**Correct Answer:** 
- **SSL-Secure Sockets Layer/TLS - Transport Layer Security**
- **Always Encrypted**
- **Transparent Data Encryption (TDE)**

**Explanation:**
To remediate the security concerns for data-at-rest you should recommend Transparent Data Encryption (TDE). To ensure data privacy, data sovereignty, and data compliance it is indispensable and mandatory to encrypt data at rest. TDE provides such a data encryption capability for data at rest and, as such, the data is protected from the unauthorized access of raw offline database files on a hard disk or a backup copy. The encryption is performed by TDE on a page level in a database, so that data is encrypted as it is written from memory to the disk and decrypted as it is read from the disk to memory.

To remediate the security concerns for data-in-use you should also recommend Always Encrypted. Always Encrypted is a security technique to hide sensitive data stored in specific database columns. Data can be only decrypted while it is loaded into memory of a client computer and processed by a client application. This technique protects data also from administrators or other support personnel that are authorized to access databases for maintenance.

To remediate the security concerns for data-in-transit you should, additionally, recommend SSL/TLS. This encryption provides protection of data from man-in-the-middle (MITM) or side channel attacks during data transportation from the backend SQL database server to the front end application server.

You should not recommend a server-level firewall. Although server-level firewalls protect from unauthorized access by end-users, it does not protect from unauthorized access by support personnel or administrators. Server-level firewalls work on the network layer (layer 3 of OSI). As an administrator, you must have access to the server in order to be able to pass by firewall for SQL server maintenance.

You should not recommend Network security groups (NSGs). Using an NSG in Azure you can filter network traffic between Azure resources. Similar to firewalls, NSGs can prohibit access by any unauthorized user or resource, but it cannot prohibit access by support personnel or administrators.

##### Question 3 (Multiple Choice)
You need to recommend a solution for the Azure SQL Database design that ensures customer data resides in the Azure region that corresponds to each customer's country of residence.

What should you recommend?

**Options:**
A. Azure Cosmos DB with multi-region writes
B. SQL elastic pools
C. Horizontal scaling by using sharding
D. Active geo-replication

**Correct Answer:** **Horizontal scaling by using sharding**

**Explanation:**
You should recommend horizontal scaling by using sharding. In Azure SQL Database, sharding is the practice of horizontally partitioning identically structured data across multiple databases based on a sharding key, where each shard is a separate database. A shard map manager stores the global shard map that associates each sharding key with its shard, and the elastic database client library uses data-dependent routing to connect each request to the shard that holds the corresponding key. Because every shard is an independent database, you can create each one in a specific Azure region, which lets you place each customer's data in the region of that customer's residence and meet the legal regulation in this scenario. Sharding is primarily a scale-out pattern, but it is the only solution among the options listed that gives you per-region placement of customer data within a single Azure SQL Database design.

You should not recommend SQL elastic pools. The databases in an elastic pool reside on a single logical server and share a set number of resources at a set price. Because all databases in a pool are on the same server, they are all in the same Azure region, so an elastic pool cannot place customer data in different regions.

You should not recommend active geo-replication. Active geo-replication continuously replicates a primary database to a readable secondary database that is usually located in a different Azure region, and it is designed as a business continuity solution for recovery from a regional outage. In this scenario, replicating customer data to a secondary database in another region would move that data outside the region of customer residence, which conflicts with the legal regulation.

You should not recommend Azure Cosmos DB with multi-region writes. Azure Cosmos DB is a NoSQL database that supports multi-region writes and can distribute data across Azure regions, but the scenario requires a design for Azure SQL Database. Migrating relational data from Azure SQL Database to Azure Cosmos DB would require redesigning the data model and the application, so it is not an appropriate recommendation for this requirement.

##### Question 4 (Multiple Choice)
In your solution design you need to recommend a solution to meet the technical requirements for Azure SQL Database.

Which solution for Azure database service tier should you recommend?

**Options:**
A. Azure SQL Hyperscale
B. An SQL Server on an Azure Virtual Machine
C. Azure SQL General Purpose
D. Azure SQL Business Critical

**Correct Answer:** **Azure SQL Business Critical**

**Explanation:**
You should recommend Azure SQL Business Critical tier. This Azure database service tier is designed to serve for mission-critical applications that require low latency and minimal downtime. This Azure database service tier utilizes Always On availability groups and high performance direct attached SSD storage. This is the best solution to meet the requirement in this scenario (eliminating the Black Friday performance bottleneck and providing high availability).

You should not recommend the Azure SQL General Purpose. This Azure database service tier provides budget-oriented balance between compute and storage. It utilizes multiple failover nodes with spare capacity. In the case of an outage, spare nodes can create a new SQL Server instance and the workload can be failed over. In addition to a higher latency compared to business critical architecture, this service tier introduces additional downtime to create a new SQL Server instance and failover workloads. In this scenario, especially for Black Friday, it is not acceptable.

You should not recommend the Azure SQL Database Hyperscale solution. This Azure database service tier is most suitable for rapid-changing storage needs, which can be rapidly scaled out up to 100TB. As the SQL database in this scenario is only 100GB and rapid growth is not expected, this service tier is not the solution you should recommend.

You should not recommend SQL Server on Azure Virtual Machine. This type of deployment is similar to what you have on premises, except that SQL server is running on an Azure virtual machine. This deployment is a one-server deployment with no guarantee of the required availability.

**References:**
- [Microsoft Learn](https://learn.microsoft.com/en-us/azure/azure-sql/database/elastic-scale-introduction)
- [Microsoft Learn](https://learn.microsoft.com/en-us/azure/azure-sql/database/service-tier-business-critical)
- [Microsoft Learn](https://learn.microsoft.com/en-us/azure/storage/files/storage-files-introduction)


---

### Question 104
**Domain:** Design Data Storage Solutions
**Subdomain:** Design non-relational data storage solutions
**Type:** Dropdown / Matching

#### Question
Your company wants to configure a storage account for a new application. The storage account must remain available if a single data center within the primary region becomes unavailable.

More than 95% of the operations that the application performs against the storage account are writes, and the application writes a high volume of small objects continuously. Each object is deleted 14 days after it is created. When the application reads an object, the data must be available immediately.

You need to recommend a solution that provides the lowest overall cost for the required usage pattern.

Which storage account type and access tier should you use? To answer, select the appropriate options from the drop-down menus.

#### Dropdown Selections
- **Storage account type** ➔ `Zone-redundant storage (ZRS)`
- **Storage account access tier** ➔ `Hot`

#### Explanation
You should use the zone-redundant storage (ZRS) account type. ZRS replicates your data synchronously across three Azure availability zones in the primary region. Each availability zone is a separate physical location with independent power, cooling, and networking, so the storage account remains available if a single data center becomes unavailable.

You should not use the locally redundant storage (LRS) account type. LRS copies your data synchronously three times within a single physical location in the primary region. Although LRS is the least expensive option, it protects only against drive and rack failures, not against the loss of an entire data center.

You should not use the geo-redundant storage (GRS) or read-access geo-redundant storage (RA-GRS) account types. Within the primary region, both GRS and RA-GRS replicate data by using LRS, so neither protects against the failure of a single data center unless you fail over to the secondary region. Both are also more expensive than ZRS.

You should use the hot access tier. The hot tier is optimized for data that is accessed or modified frequently. It has the highest data storage cost of the online tiers but the lowest transaction cost, and it has no minimum retention duration. Because more than 95% of the application's operations are writes and each object is deleted after 14 days, transaction costs, not per-gigabyte storage costs, dominate the total cost of this workload, so the hot tier is the least expensive option overall.

You should not use the cool access tier. The cool tier is intended for data that is accessed or modified infrequently. It offers a lower data storage cost than the hot tier, but its transaction costs are higher, which is more expensive for a write-intensive workload. In addition, objects in the cool tier on a general-purpose v2 account have a minimum retention duration of 30 days, so deleting each object after 14 days would incur an early deletion penalty.

You should not use the archive access tier. Although the archive tier has the lowest data storage cost, blobs in the archive tier are offline and cannot be read until they are rehydrated to an online tier, which can take up to 15 hours, so the tier does not meet the requirement for immediate availability. The archive tier also has a minimum retention duration of 180 days and cannot be set as the default access tier of a storage account.

**Reference:** [Microsoft Learn](https://learn.microsoft.com/en-us/azure/storage/blobs/access-tiers-overview)


---

### Question 105
**Domain:** Design Data Storage Solutions
**Subdomain:** Design relational data storage solutions
**Type:** Dropdown / Matching

#### Question
You plan to migrate an on-premises database to an Azure SQL database elastic pool. The database size is now 250 GB.

You need to recommend a DTU-based service tier and pool size that meets the following requirements:

* Backup retention must be at least 14 days.
* In-memory OLTP must be supported.
* Columnstore indexes must be supported.
* There must be at least 8 GB in-memory OLTP storage per pool guaranteed.

Which tier and number of eDTUs per pool should you recommend? To answer, select the appropriate options from the drop-down menus.

#### Dropdown Selections
- **Tier** ➔ `Premium`
- **eDTUs per pool** ➔ `1000`

#### Explanation
You should recommend the Premium Database Transaction Unit-based (DTU-based) service tier. It supports in-memory online transaction processing (OLTP) and columnstore indexes. It also has the lowest latency because it is built on solid-state drives. Note that columnstore indexes are supported from Standard S3 upward and in elastic pools of 100 eDTU or more, so in-memory OLTP - and the requirement for at least 8 GB of in-memory OLTP storage per pool - is what rules Standard out here.

You should not recommend the Basic DTU-based service tier. It does not support in-memory OLTP and columnstore indexes. It is mostly used for development environments and should not be used for critical production environments.

You should not recommend the Standard DTU-based service tier. It does not support in-memory OLTP.

You should recommend 1000 eDTUs so that you can have up to 10 GB for in-memory OLTP storage per pool guaranteed (which satisfies the requirement for at least 8 GB).

You should not recommend 500 eDTUs. This allows up to only 4 GB for in-memory OLTP storage per pool guaranteed.

You should not recommend 125 eDTUs. This only guarantees up to 1 GB for in-memory OLTP storage per pool.

**Reference:** [Microsoft Learn](https://learn.microsoft.com/en-us/azure/azure-sql/database/resource-limits-dtu-elastic-pools)


---

### Question 106
**Domain:** Design Data Storage Solutions
**Subdomain:** Design business continuity and relational disaster recovery
**Type:** Multiple Choice

#### Question
You have deployed an application that stores relational data using Azure SQL Database. To enhance availability, you are designing a disaster recovery strategy for the database to protect against regional failures.

You need to recommend a solution, which in the event of a regional failure, must meet the following requirements:

* The recovery time objective (RTO) must not exceed 1 hour.
* The recovery point objective (RPO) must not exceed 5 seconds.
* Connection strings must use a single read-write listener endpoint.

Which disaster recovery options should you include in your recommendation?

#### Options
A. Manual database failover
B. Auto-failover groups
C. Geo-restore
D. Zone-redundant storage (ZRS)

#### Correct Answer
**Auto-failover groups**

#### Explanation
You should include auto-failover groups in your disaster recovery recommendation. This solution provides continuous asynchronous replication between primary and secondary databases across regions while exposing a single stable read-write listener endpoint. This ensures that the 1-hour automatic failover recovery time objective (RTO) and 5-second recovery point objective (RPO) requirements are met without requiring application connection string changes.

You should not include manual database failover in your disaster recovery recommendation. While manual failover with Active Geo-replication can achieve a very low recovery time, individual geo-replicated databases do not provide native read-write listener endpoints. This option would require manual updates or script execution to reconfigure application connection strings after a failover.

You should not include geo-restore in your disaster recovery recommendation. This option relies entirely on automated geo-replicated backups rather than real-time active data replication. While restoring from geo-backups can provide an RPO of 1 hour, its RTO is longer and may be up to 12 hours, which fails the required target.

You should not include zone-redundant storage (ZRS) in your disaster recovery recommendation. This configuration synchronizes database replicas exclusively across availability zones within a single primary region. Therefore, it cannot protect your application or data against a full regional outage.

**Reference:** [Microsoft Learn](https://learn.microsoft.com/en-us/azure/azure-sql/database/failover-group-sql-db)


---

### Question 107
**Domain:** Design Data Storage Solutions
**Subdomain:** Design data governance and analytics solutions
**Type:** Multiple Select

#### Question
You support a development team that utilizes Azure Databricks for machine learning (ML) tasks. The team uses Lakeflow pipelines for data processing and has asked you to recommend a solution that will allow members from other teams to query the tables produced by their pipelines using Databricks SQL.

Which two tasks could the team perform to publish the tables to Unity Catalog? Each correct answer presents a complete solution.

#### Options
A. Specify a schema name in the pipeline settings.
B. Create a shared access signature (SAS) for the target tables.
C. Define a catalog where the pipeline can persist tables.
D. Configure strong consistency for the database.
E. Set the target value in a JSON configuration file.

#### Correct Answer
- **Specify a schema name in the pipeline settings.**
- **Define a catalog where the pipeline can persist tables.**

#### Explanation
The team should specify a schema name in the pipeline settings or define a catalog where the pipeline can persist tables. Azure Databricks is an Apache Spark based analytics platform that can be used for tasks such as machine learning (ML). Databricks defines analytical workflows using pipelines, which can include data ingestion, transformation, analysis, and visualization tasks, and Lakeflow pipelines is framework to support this task. By default, the data in a pipeline can only be accessed by tasks in the pipeline itself. To make this data accessible outside the pipeline, you can publish it to a Unity Catalog by specifying a target schema or defining a target catalog in the pipeline settings.

The team should not set the target value in a JSON configuration file. Publishing tables to Unity Catalog requires configuration through the Unity Catalog management interface in Databricks, not through JSON files.

The team should not create a shared access signature (SAS) for the target tables. A SAS allows you to implement granular security controls for Azure Storage resources including files, blobs, tables, and other storage constructs. When a SAS is defined, a Uniform Resource Identifier (URI) is created and is associated with the permissions, expiry, and other restrictions you have configured for the SAS. You can then share this URI with internal and external users without compromising the keys associated with your storage account.

The team should not configure strong consistency for the database. Azure Cosmos DB uses consistency levels to define how effectively a database engine can return data that is the most up-to-date. Azure Cosmos DB supports five consistency levels, with the strong consistency level guaranteeing that all reads will return the most recently committed write.

**Reference:** [Microsoft Learn](https://learn.microsoft.com/en-us/azure/databricks/data-governance/unity-catalog/index)


---

### Question 108
**Domain:** Design Data Storage Solutions
**Subdomain:** Design data integration and ingestion solutions
**Type:** Multiple Choice

#### Question
You work for a consumer sales company that has gathered market data from a variety of sources. You have noticed that the data from some sources has schema drift issues.

You need to recommend a data preparation solution to prepare the data for analysis. The solution needs to minimize development effort.

Which Azure service should you recommend?

#### Options
A. Azure Logic Apps
B. Azure Data Factory
C. Azure Stream Analytics
D. Azure Functions

#### Correct Answer
**Azure Data Factory**

#### Explanation
You should recommend Azure Data Factory because it can help you to develop graphical data transformation logic without writing code. It can also protect against schema drift (Mapping Data Flows have native Schema Drift handling).

You should not recommend Azure Functions because, for every schema change, you would need to change the function code as well.

You should not recommend Azure Stream Analytics. For every schema change, you would need to change the code of the job.

You should not recommend Azure Logic Apps because any change to the schema of the input objects would require a change to the structure of the application.

**Reference:** [Microsoft Learn](https://learn.microsoft.com/en-us/azure/data-factory/concepts-data-flow-schema-drift)


---

### Question 109
**Domain:** Design Data Storage Solutions
**Subdomain:** Design storage security and data protection
**Type:** Multiple Choice

#### Question
You are designing a backup and recovery solution for your Azure Blob Storage to protect your unstructured data stored in a blob container of a storage account.

You need to provide recommendations to protect against data loss arising from the accidental deletion of the storage account.

What should you recommend for implementation?

#### Options
A. Resource locks
B. Blob soft delete
C. Container soft delete
D. Blob versioning

#### Correct Answer
**Resource locks**

#### Explanation
You should recommend resource locks for implementation. Resource locks provide an extra layer of protection by preventing users from accidentally deleting or modifying critical Azure resources, such as storage accounts and their containers. By applying a resource lock (CanNotDelete) to the storage account or resource group, you can ensure that no one can delete the resource without first removing or disabling the lock.

Although all the other options are also relevant in terms of data protection, they are more focused on the data within the blob storage rather than protecting against the accidental deletion of the entire storage account.

Blob soft delete is a feature that allows you to recover deleted blobs and their snapshots within a specified retention period. It helps in recovering accidentally deleted data within the blob storage, but it does not protect against the accidental deletion of the entire storage account.

Similar to blob soft delete, container soft delete allows you to recover deleted containers and their content within a specified retention period. This is useful for recovering accidentally deleted containers and their data, but it does not protect against the deletion of the entire storage account.

Blob versioning helps in preserving and accessing previous versions of blobs in the storage container. This is useful for tracking changes and recovering older versions of blobs, but it does not specifically protect against the accidental deletion of the entire storage account.

**Reference:** [Microsoft Learn](https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/lock-resources)


---

### Question 110
**Domain:** Design Data Storage Solutions
**Subdomain:** Design non-relational data storage solutions
**Type:** Multiple Choice

#### Question
You are designing a storage plan for unstructured data using Azure Blob Storage. You have been given the following requirements:

* Availability should be 99% or higher.
* Retrieval latency should be measured in milliseconds.
* Storage costs should be minimized.

Which Azure blob access tiers should you include in your design?

#### Options
A. Premium Blob Storage
B. Hot access tier
C. Cool access tier
D. Archive access tier

#### Correct Answer
**Cool access tier**

#### Explanation
You should include the cool Azure blob access tier in your design. Of the access tiers offered in this question scenario, the cool access tier is the only one that meets all the requirements while also minimizing storage costs. The cool access tier is primarily designed to store data that needs to be readily available but is not accessed frequently. Like the hot tier it is an online tier with millisecond-scale retrieval latency, and among the options listed it has the lowest storage cost. Note that Azure also offers a cold online tier, which is cheaper still for data kept at least 90 days.

You should not include the hot access tier in your design. Although this tier meets the availability and latency requirements in this scenario, it does so at a higher storage cost. This tier is designed to store data that is accessed frequently and as a result has lower transaction costs.

You should not include the archive access tier in your design. As the name implies, this tier is designed to hold data that has been archived. As archive data is stored offline, it can take several hours between when the data is requested and when it is available. This tier boasts the lowest storage costs.

You should not include the Premium Blob Storage tier in your design. This tier offers the same availability as the hot tier but boasts single-digit milliseconds of latency times. This means that the latency between when data is requested and when it is returned is minimized. This is accomplished by storing data on fast solid-state drives (SSDs). The Premium Blob Storage tier also incurs higher costs.

**Reference:** [Microsoft Learn](https://learn.microsoft.com/en-us/azure/storage/blobs/access-tiers-overview)


---

### Question 111
**Domain:** Design Data Storage Solutions
**Subdomain:** Design data warehousing and big data storage
**Type:** Multiple Choice

#### Question
You are managing a data migration project. You have just discovered a new 12TB store of unstructured data. You suspect similar stores will be discovered as the project progresses. You need to design a solution for this data set that meets the following requirements:

* Data must be stored in its unfiltered, raw format.
* The solution must scale easily and at minimal cost.
* Relational and non-relational data must be supported.

Which of the following should you include in your design?

#### Options
A. Azure Data Lake
B. Azure Files
C. Azure SQL Database
D. Azure Data Factory

#### Correct Answer
**Azure Data Lake**

#### Explanation
You should include Azure Data Lake in your design. Azure Data Lake is a massively scalable data storage solution built on Azure Blob storage. It is primarily used to store large data sets used in machine learning, real-time analytics, or other similar scenarios. Among its other features, Azure Data Lake can store structured, semi-structured, and unstructured data, and it can store all three types of data in a single repository. Azure Data Lake scales more easily and at a lower cost than other storage solutions, such as Azure Cosmos DB. Finally, Azure Data Lake can store both relational and non-relational data in their raw file formats, for example Parquet, Delta or CSV for tabular data, and those files can be queried by engines such as Azure Synapse Analytics, although Data Lake is not itself a relational database engine.

You should not include Azure Files in your design. Azure Files is the primary file storage and sharing solution on the Azure platform and is optimized for the random-access workloads common in a file-sharing scenario. In its most basic form, Azure Files is designed to replace traditional Windows Server-based file shares using Server Messaging Blocks (SMB) for Windows clients, or Network File System for *nix-based clients. Azure Files is also accessible via the Azure Files Representational State Transfer (REST) Application Programming Interface (API).

You should not include Azure Structured Query Language (SQL) database in your design. Azure SQL Database is a cloud-based database platform based on Microsoft SQL Server, a platform that has been around for decades and is designed to provide high-performance transactional data processing. While Azure SQL Database is capable of storing non-relational data, data must be structured in such a way that it can be queried using SQL. Additionally, Azure SQL Database does not scale as efficiently as Azure Data Lake.

You should not include Azure Data Factory in your design. Azure Data Factory helps to bridge data sources by facilitating data-driven workflows. It can be used to extract data from a cloud-based or on-premises data source, such as a database server, transform that data using rules and filters you specify, and then load that data into a new destination, such as Azure Synapse Analytics.

**Reference:** [Microsoft Learn](https://learn.microsoft.com/en-us/azure/storage/blobs/data-lake-storage-introduction)


---

### Question 112
**Domain:** Design Data Storage Solutions
**Subdomain:** Design data warehousing and query virtualization
**Type:** Multiple Choice

#### Question
Your organization uses Microsoft SQL Server to support operational tasks and Azure Synapse Analytics for analytical tasks. Recently, the organization acquired a competitor and you have been asked to recommend a solution for integrating that data into Azure Synapse.

Your solution must eliminate the need for extract, transform, load (ETL) processes. Additionally, developers must be able to query the data using the internal SQL Server instance.

What should you include in your recommendation?

#### Options
A. Migrate the data to Azure Files and configure the Azure REST API for queries.
B. Install a self-hosted integration runtime on the server hosting the data.
C. Virtualize the competitor's data through the SQL instance using PolyBase.
D. Publish the data through Azure Cosmos DB using the change feed feature.

#### Correct Answer
**Virtualize the competitor's data through the SQL instance using PolyBase.**

#### Explanation
You should recommend that your organization virtualize the competitor's data through the SQL instance using PolyBase. Azure Synapse Analytics provides a platform for storing, analyzing, and visualizing data at scale. In this scenario, while the newly acquired competitor's data could be loaded into a Synapse data warehouse, you have been asked to avoid using this approach. However, Synapse's analytical power can be expanded to consume external data from both non-relational and relational datasets using PolyBase technology. PolyBase makes the external data query-able by virtualizing the data through a Microsoft SQL instance. Once configured, your developers will be able to query both the internal Synapse data and the external customer data concurrently.

You should not recommend that your organization install a self-hosted integration runtime on the server hosting the data. Azure Data Factory uses integration runtimes to bridge data sources by facilitating data-driven workflows. While Data Factory can be used to extract data from a cloud-based or on-premises data source, such as a database server, you have been asked to recommend a solution that allows the data to remain in its original location.

You should not recommend that your organization migrate the data to Azure Files and configure the Azure REST API for queries. Azure Files is the primary file storage and sharing solution on the Azure platform and is optimized for the random access workloads common in a file-sharing scenario. Azure Files supports connections via Server Messaging Blocks (SMB), Network File System (NFS), or the Azure Representational State Transfer (REST) Application Programming Interface (API). This method cannot be used to allow your developers to query the data using the internal SQL Server instance.

You should not recommend that your organization publish the data through Azure Cosmos DB using the change feed feature. Azure Cosmos DB is designed to provide practically limitless storage at a massive scale and can support both relational and nonrelational data models, including open-source PostgreSQL, Apache Cassandra, and MongoDB. However, using Cosmos DB would require the data to be extracted, possibly transformed, and then loaded into Cosmos DB.

**Reference:** [Microsoft Learn](https://learn.microsoft.com/en-us/sql/relational-databases/polybase/polybase-guide)


---

### Question 113
**Domain:** Design Data Storage Solutions
**Subdomain:** Design data analytics and stream processing
**Type:** Multiple Choice

#### Question
You are part of a team that uses Azure Stream Analytics to collect and analyze sensor data in real time. Recently, you have discovered that the incoming data has frequent value spikes that are skewing results.

You need to identify which Azure Stream Analytics feature to use to analyze this data and perform calculations based on time intervals.

Which feature should you use?

#### Options
A. Windowing functions
B. Aggregate functions
C. Array functions
D. Date and time functions

#### Correct Answer
**Windowing functions**

#### Explanation
You should use windowing functions. Azure Stream Analytics is used to ingest, process, and analyze streaming data in real time. This is useful when real-time decision making is needed. For example, an e-tailer may want to analyze how customers interact with its website to provide real-time purchase recommendations. Streaming data can come from a variety of sources, including transaction processing systems, Internet of Things (IoT) devices, or mobile devices. Stream Analytics provides a variety of functions for performing this analysis, and windowing functions allow streaming data to be analyzed within a specific time window. For example, you could use a windowing function on streaming environmental sensor data to calculate the average temperature for every sixty-minute interval.

You should not use aggregate functions. Aggregate or group functions are used to analyze a set of values and return a single scalar value, such as a minimum or maximum value in a data set. Aggregate functions can be used with windowing functions, as in the example above where the average temperature is calculated but cannot group data into time intervals on their own.

You should not use date and time functions. These functions are used to manipulate and format date or time values. For example, you could use the MONTH function to extract the month from a date-time value.

You should not use array functions. Arrays are collections of items or elements and can be loosely compared to spreadsheets or database tables, and array functions are used to manipulate arrays. For example, you could use the GetArrayElement function to return the third element in an array of three or more elements.

**Reference:** [Microsoft Learn](https://learn.microsoft.com/en-us/azure/stream-analytics/stream-analytics-window-functions)


---

### Question 114
**Domain:** Design Data Storage Solutions
**Subdomain:** Design data warehousing and query virtualization
**Type:** Dropdown / Matching

#### Question
You have implemented a data analysis solution utilizing Azure Synapse Analytics. Recently, your AI engineering team has implemented Apache Spark in one of the machine learning (ML) pipelines and wants to query the external Spark tables from the Synapse workspace.

You need to recommend a solution that allows engineers to analyze data from the Spark tables using T-SQL without requiring deploying or managing clusters or other infrastructure.

What should you include in your recommendation? To answer, select the appropriate options from the drop-down menus.

#### Dropdown Selections
- **To allow users to analyze data using T-SQL, you should** ➔ `utilize the built-in SQL pool.`
- **To allow users to query external Spark tables, you should** ➔ `configure Private Link.`

#### Explanation
To allow users to analyze data using T-SQL, you should utilize the built-in Structured Query Language (SQL) pool. Azure Synapse Analytics provides a platform for storing, analyzing, and visualizing data at scale. This process is configured and managed using an Azure Synapse Analytics workspace, and every workspace includes a serverless SQL pool. One benefit of this approach is that no additional infrastructure is required, and you can query your data using T-SQL syntax. The serverless SQL pool scales automatically as needed, and you are only charged for the queries you run without the need to worry about instance utilization, storage, or other concerns.

To allow users to query external Spark tables, you should configure Private Link. Private Link provides secure connectivity between an Azure virtual network and Microsoft services such as Azure Synapse Analytics. In addition to facilitating connectivity between Synapse and your external Apache Spark tables, Private Link enhances security by ensuring your data never leaves Microsoft-owned network infrastructure.

To allow users to analyze data using T-SQL, you should not create a dedicated SQL pool or implement Azure SQL Database. While valid for data storage in this scenario, both options require supporting infrastructure.

To allow users to query external Spark tables, you should not configure PolyBase or Azure Synapse Link. PolyBase is used to integrate external data with Azure Synapse Analytics; however, it does not support querying Apache Spark tables directly across environments in this manner. Similarly, Azure Synapse Link is designed to support integration with SQL or Cosmos DB databases, not Apache Spark tables.

**Reference:** [Microsoft Learn](https://learn.microsoft.com/en-us/azure/synapse-analytics/sql/on-demand-workspace-overview)


---

### Question 115
**Domain:** Design Data Storage Solutions
**Subdomain:** Design non-relational data storage solutions
**Type:** Dropdown / Matching

#### Question
You are designing a storage solution that will facilitate the migration of on-premises data to the Azure cloud. As part of this migration, you have been tasked with consolidating resources where possible to minimize costs while still providing the required features and performance. Your design must address the following requirements:

* Data should be accessible via SMB or a REST API.
* The solution should be optimized for random access workloads.
* Affordability should be prioritized over low latencies or support for heavy workloads.

Which storage technology and storage tier should you include in your design? To answer, select the appropriate options from the drop-down menus.

#### Dropdown Selections
- **Storage technology** ➔ `Azure Files`
- **Storage tier** ➔ `Transaction optimized`

#### Explanation
You should recommend Azure Files as the storage technology in your design. Azure Files is the primary file storage and sharing solution on the Azure platform. In its most basic form, Azure Files is designed to replace traditional Windows Server-based file shares using Server Message Block (SMB) for Windows clients, or Network File System (NFS) for *nix-based clients. Azure Files is also accessible via the Azure Files Representational State Transfer (REST) Application Programming Interface (API). Note that while *nix-based clients typically use NFS to access file shares, most modern operating systems, including Linux and MacOS, also support SMB-based file shares.

You should recommend the transaction optimized storage tier. Transaction optimized, hot, and cool are access tiers hosted on the same HDD storage hardware, so the difference between them is not performance but price: the data at-rest storage price is lower in the cooler tiers, while the transaction price is higher in the cooler tiers. Transaction optimized, as its name implies, optimizes the price for high-transaction workloads, because it has the lowest transaction prices of the three tiers. This is what the scenario calls for. The design must facilitate the migration of on-premises data into Azure, and a migration generates a very large number of transactions over a short period, so the tier with the lowest transaction prices keeps the cost of that phase down. This is also Microsoft's documented recommendation: regardless of the method used to migrate existing data into Azure Files, create the file share in the transaction optimized access tier, then measure the actual transaction counts once the share is running under normal usage and select the definitive access tier from there. The tier also satisfies the requirement that affordability be prioritized over low latencies and support for heavy workloads, since it is an HDD-based tier rather than an SSD-based one.

You should not recommend the hot access tier in your design. Hot is the middle ground between the transaction optimized and cool tiers: it has a slightly lower data at-rest storage price but higher transaction prices than transaction optimized. Because a migration is transaction-intensive, those higher transaction prices would outweigh the saving on stored data during the phase this design must accommodate.

You should not recommend Azure Blob Storage or Azure NetApp Files as the storage technology in your design. Azure Blob Storage would be the best choice for read-heavy workloads such as storing massive datasets used in analytical applications. Azure Blob Storage does not support SMB access.

Azure NetApp Files supports massive Input/Output Operations Per Second (IOPS) workloads and provides low-latency along with advanced management capabilities. Azure NetApp Files does not provide REST API access to file data.

You should not recommend the premium storage tier in your design. This tier offers higher performance than the HDD-based access tiers but does so at an increased cost. Premium file shares are solid-state drive (SSD) backed, which offers increased performance.

**Reference:** [Microsoft Learn](https://learn.microsoft.com/en-us/azure/storage/files/storage-files-planning#storage-tiers)


---

### Question 116
**Domain:** Design Data Storage Solutions
**Subdomain:** Design relational data storage solutions
**Type:** Yes/No Statements Table

#### Question
You are the lead architect for a new data analytics startup in the Dallas-Fort Worth metropolitan area. You decide on a cloud-only infrastructure in Azure. You currently have data in approximately 50 SQL databases that must be analyzed. Usage patterns vary between databases. The solution is expected to use several databases that will remain in use for at least two years.

You need to contain costs as much as possible and look for ways to reduce expenditures.

How should you consider deploying the solution to minimize costs? For each of the following statements, select Yes if the statement is true. Otherwise, select No.

#### Statements Evaluation
- **Statement:** Using SQL elastic pools to manage your databases will save costs.
  - **Answer:** `Yes`
  - **Rationale:** Using SQL elastic pools to manage your databases will save costs. With elastic pools, multiple databases are on a single server and can share resources, which saves costs when usage patterns vary between databases.
- **Statement:** Configuring the databases to have the Price:Low tag will save costs.
  - **Answer:** `No`
  - **Rationale:** Configuring the databases to have the Price:Low tag will not save costs. Tags are used for adding metadata to Azure resources and to logically organize them into a taxonomy. Tags do not directly affect resource cost.
- **Statement:** Using reserved capacity instead of pay-as-you-go will save costs.
  - **Answer:** `Yes`
  - **Rationale:** Using reserved capacity instead of pay-as-you-go will save costs. Pre-paying to reserve a database for one or three years is much more cost-effective than a pay-as-you-go arrangement, especially since these databases will remain in use for at least two years.

#### Explanation
Using SQL elastic pools to manage your databases will save costs. With elastic pools, multiple databases are on a single server and can share resources, which saves costs.

Configuring the databases to have the Price:Low tag will not save costs. Tags are used for adding metadata to Azure resources and to logically organize them into a taxonomy. Tags do not directly affect resource cost.

Using reserved capacity instead of pay-as-you-go will save costs. Pre-paying to reserve a database for one or three years is much more cost-effective than a pay-as-you-go arrangement.

**Reference:** [Microsoft Learn](https://learn.microsoft.com/en-us/azure/azure-sql/database/cost-management)


---

### Question 117
**Domain:** Design Data Storage Solutions
**Subdomain:** Design relational data storage solutions
**Type:** Multiple Choice

#### Question
You are designing a database solution for the databases hosted in an on-premises environment. Currently, there are 10 databases that are hosted on individual VMs. Each database has varying usage patterns and the resources on the VM are underutilized.

You need to recommend a database solution that minimizes costs and reduces the administrative overhead. The solution should meet the following requirements:

* The solution should have a 99.99% uptime SLA.
* The resources in the solution can scale dynamically.
* The solution should have geo-replication capabilities.

Which solution should you recommend?

#### Options
A. 10 Azure SQL databases
B. 10 databases running in SQL server VMs
C. An Azure SQL database elastic pool hosting 10 databases
D. 10 Azure SQL Managed Instances

#### Correct Answer
**An Azure SQL database elastic pool hosting 10 databases**

#### Explanation
You should recommend an Azure SQL database elastic pool hosting 10 databases. Elastic pools allow putting multiple databases on the same Azure SQL server instance. Since the 10 databases have varying usage patterns and underutilized resources on the VM, an elastic pool can greatly reduce the cost and maintenance by hosting them together. In an elastic pool, the resources are shared among all the databases. You can scale dynamically based on the usage anytime. Since it is an Azure managed service, it is backed up with a minimum of 99.99% uptime SLA. You can also enable geo-replication for individual databases to prevent them from any disasters.

You should not recommend 10 Azure SQL databases. This solution almost meets all the requirements, but the databases would still be underutilized and you would need to manage 10 Azure SQL databases individually. This solution would also increase the costs, since you would pay for 10 Azure SQL databases independently.

You should not recommend 10 databases running in SQL server VMs. This would be a very similar setup that the one you are currently running on the on-premises environment. Since it is a IaaS service, you need to design for high availability by yourself using VM scale sets or availability sets, which can provide 99.99% uptime SLA, however, the cost to run the solution would be high. Replicating databases to another region would also become your responsibility.

You should not recommend 10 Azure SQL Managed Instances. Managed Instance is also a managed service that fulfills the requirements, however, it would be costly to run and would leave resources underutilized.

**Reference:** [Microsoft Learn](https://learn.microsoft.com/en-us/azure/azure-sql/database/elastic-pool-overview)


---

### Question 118
**Domain:** Design Data Storage Solutions
**Subdomain:** Design storage security and data protection
**Type:** Multiple Choice

#### Question
You plan to migrate company data to an Azure storage account.

The company policy states that company data must be encrypted by using the company's own encryption key.

You need to identify the Azure storage account services that can be used to meet the company requirements for storing the data.

Which storage account services can you use?

#### Options
A. Azure Blob storage, Azure Files, Azure Table storage and Azure Queue storage
B. Azure Blob storage and Azure Files only
C. Azure Blob storage, Azure Files and Azure Table storage only
D. Azure Blob storage only

#### Correct Answer
**Azure Blob storage, Azure Files, Azure Table storage and Azure Queue storage**

#### Explanation
Storage service encryption protects your data at rest. Azure Storage encrypts your data while it is written in Azure datacenters, and automatically decrypts it for you when you access it.

You can use all Azure Storage account services with a custom encryption key. By default, data is encrypted using Microsoft Managed Keys for Azure Blob storage, Azure Table storage, Azure Files and Azure Queue storage. You may bring your own custom key for encryption for Azure Blob storage and Azure Files services. To use a custom encryption key for Azure Table storage and Azure Queue storage, you need to create a storage account that uses a key scoped to the account instead of a key scoped to the services.

**Reference:** [Microsoft Learn](https://learn.microsoft.com/en-us/azure/storage/common/customer-managed-keys-overview)


---

### Question 119
**Domain:** Design Data Storage Solutions
**Subdomain:** Design data streaming and non-relational storage integration
**Type:** Multiple Select

#### Question
A company has two applications named App1 and App2 for a point of sale (POS) system that are deployed by using Azure Functions. App1 scans products and publishes a transaction event for each scanned item. App2 consumes the transaction events, processes the payment, and publishes a payment status event that App1 consumes. The applications currently use Azure Queue Storage to transfer the events.

In the future, the applications will process large volumes of events as new stores open. All transaction and payment status events must also be retained in a NoSQL database for reporting.

You need to recommend a solution to replace Azure Queue Storage. The solution must provide high throughput and must store the event data in a NoSQL database.

Which two solutions should you recommend? Each correct answer presents part of the solution.

#### Options
A. Azure Data Factory
B. Azure Event Hubs
C. Azure Stream Analytics
D. Azure Service Bus

#### Correct Answer
- **Azure Event Hubs**
- **Azure Stream Analytics**

#### Explanation
You should recommend Azure Event Hubs. Event Hubs is a real-time data streaming platform and event ingestion service that can receive and process millions of events per second, which provides the high throughput that the solution requires as new stores open. Event Hubs uses a publish-subscribe model with consumer groups, so multiple consumer applications can read the same event stream independently. Azure Functions provides an Event Hubs trigger, so App1 and App2 can each run in response to the events that are published to the event hub.

You should also recommend Azure Stream Analytics. Stream Analytics is a real-time analytics engine that supports Azure Event Hubs as a data stream input and Azure Cosmos DB as an output. Stream Analytics can read the events from the event hub, process them, and write them as JSON documents to a container in Azure Cosmos DB for NoSQL, which meets the requirement to store the event data in a NoSQL database.

You should not recommend Azure Service Bus. Service Bus is an enterprise message broker designed for transactional messaging with high-value payloads, whereas Event Hubs is the Azure service designed for big data streaming and event ingestion. In addition, Stream Analytics does not support Service Bus as an input. The supported data stream inputs are Azure Event Hubs, Azure IoT Hub, Azure Blob Storage, Azure Data Lake Storage Gen2, and Apache Kafka. You would therefore need to build an additional application to read from Service Bus and write the data to the NoSQL database.

You should not recommend Azure Data Factory. Data Factory is a data integration service that is used for Extract, Transform, and Load (ETL) and Extract, Load, and Transform (ELT) operations, and its pipelines can write data to Azure Cosmos DB. However, Data Factory cannot read events directly from an event hub. You would first need to enable Event Hubs Capture to write the event data to an Azure Blob Storage or Azure Data Lake Storage account, and then configure a Data Factory pipeline to read the captured files from that account. This adds components and latency without meeting the real-time requirement.

**Reference:** [Microsoft Learn](https://learn.microsoft.com/en-us/azure/stream-analytics/stream-analytics-define-outputs#azure-cosmos-db)


---

### Question 120
**Domain:** Design Identity, Governance, and Monitoring Solutions
**Subdomain:** Design an identity and access management solution
**Type:** Multiple Choice

#### Question
Company1 has a Microsoft Entra tenant named company1.com.

Company1 uses groups to provide access to resources. Each employee has a user in company1.com. Employees frequently change company positions and often still have access to resources they no longer need.

You need to recommend a solution to automatically remove users from groups that they no longer need to be in.

What should you recommend?

#### Options
- Group expiration
- Microsoft Entra ID Protection
- Access review
- Conditional access

#### Correct Answer
- **Access review**

#### Explanation
You should recommend access review. Access review can be performed once or periodically and you can configure who should perform the review, either the group owner or the group members themselves. At the end of the evaluation period, users who no longer need membership can be automatically removed from the group. Based on the configuration, users for whom the review is not performed can also be removed from the group automatically.

You should not recommend conditional access. Conditional access enables you to control access to cloud apps. You can specify who can access the app, from which devices, which threat level is allowed, and any other conditions that must be met before the user can access the app.

You should not recommend group expiration. Group expiration can be configured only for Microsoft 365 groups, not security groups. Only security groups can be granted access to resources, not Microsoft 365 groups.

You should not recommend Microsoft Entra ID Protection. Microsoft Entra ID Protection is used to detect and prevent risky sign-ins. It cannot be used to remove users from groups automatically.

**Reference:** [Microsoft Learn](https://learn.microsoft.com/en-us/entra/id-governance/access-reviews-overview)


---

### Question 121
**Domain:** Design Identity, Governance, and Monitoring Solutions
**Subdomain:** Design an identity and access management solution
**Type:** Multiple Choice

#### Question
You have a hybrid identity environment that includes an on-premises Active Directory environment and a Microsoft Entra ID.

You need to create an authentication solution that verifies the following:

* That on-premises AD security policies are applied.
* That passwords are validated against your on-premises AD.
* That passwords are not stored in the cloud.

Which solution should you use?

#### Options
- Single sign-on (SSO)
- Pass-through authentication
- Password hash synchronization
- Federated authentication

#### Correct Answer
- **Pass-through authentication**

#### Explanation
You should use pass-through authentication. This method does not store passwords or password hashes in the cloud; passwords are validated on-premises by a lightweight authentication agent that communicates with Microsoft Entra ID, so on-premises AD policies are enforced.

You should not use federated authentication. Federation delegates authentication to an external system (for example, AD FS), which requires deploying and maintaining additional servers.

You should not use password hash synchronization. With password hash synchronization (PHS) a hash of the on-premises password hash is synchronized to and stored in Microsoft Entra ID, so it does not meet the requirement that passwords are not stored in the cloud.

You should not use single sign-on (SSO). SSO is an umbrella term for signing in once; it is not itself an authentication method that satisfies these password-handling requirements.

**Reference:** [Microsoft Learn](https://learn.microsoft.com/en-us/entra/identity/hybrid/connect/how-to-connect-pta)


---

### Question 122
**Domain:** Design Identity, Governance, and Monitoring Solutions
**Subdomain:** Design a logging and monitoring solution
**Type:** Multiple Choice

#### Question
You are managing an Azure hybrid environment with resources on premises and in the cloud. You are requested to collect all diagnostic and audit logs centrally in an external third-party security information and event management (SIEM) system.

You need to recommend the most suitable solution to route resource logs to an external third-party SIEM. The solution must provide maximum flexibility and customization in terms of real-time processing and routing logs to different destinations.

What should you recommend?

#### Options
- Azure Log Analytics workspace
- Azure storage account
- Azure Service Bus
- Azure Event Hubs

#### Correct Answer
- **Azure Event Hubs**

#### Explanation
You should recommend Azure Event Hubs. Azure Event Hubs is designed for high-throughput, real-time data streaming and provides the flexibility to process and route logs to various destinations, including an external third-party SIEM system. You can configure your resources to send their diagnostic and audit logs to an Azure Event Hubs and then use custom applications or integrations to transform and forward the logs to your external SIEM. This approach allows you to implement custom processing logic, filtering, and formatting before sending the logs to the SIEM, ensuring that they meet the requirements of the third-party system. Azure Event Hubs' scalability, data distribution capabilities, and real-time processing make it a strong candidate for managing logs in a hybrid environment and integrating them with external SIEM solutions.

While Azure Log Analytics and an Azure storage account have their use cases, neither provides the same level of flexibility and real-time processing capabilities as Azure Event Hubs for sending logs to an external third-party SIEM system, especially when the goal is to process and route logs to different destinations. A partner solution could also be a strong choice if it aligns well with your requirements and provides the necessary customization and integration options.

Azure Log Analytics workspace is a service that helps you to collect, analyze, and visualize data from your resources. It is commonly used for monitoring and managing Azure resources, as well as on-premises resources through agents. You can configure diagnostic and audit logs from your resources to be sent to a Log Analytics workspace. Once collected, you can perform queries, create alerts, and build custom dashboards to monitor and troubleshoot your environment. While Log Analytics is powerful for Azure monitoring, it might not be the best option for sending logs to an external third-party SIEM system.

Azure storage accounts allow you to store various types of data, including logs, in different storage services like Blobs, Tables, Queues, and Files. While you could store your resource logs in an Azure storage account, it is primarily a storage solution. You would need to implement a mechanism or application to regularly fetch logs from the storage and send them to your third-party SIEM system. This approach would require more custom development and might not provide the same level of log processing and real-time integration as Azure Event Hubs.

Azure Service Bus is primarily designed for reliable messaging and communication between applications. While Azure Service Bus is a good choice for facilitating information exchange among various applications and services through messages, it may not be the optimal solution for the task of centralizing logs. In this context, a more fitting solution is Azure Event Hubs. In the broader sense, a message takes on the form of a container adorned with metadata, serving as a vessel for encapsulating data. This data has the capacity to encompass a variety of information types, including structured data encoded in prevalent formats such as JSON, XML, Apache Avro, and Plain Text.

**Reference:** [Microsoft Learn](https://learn.microsoft.com/en-us/azure/azure-monitor/essentials/stream-monitoring-data-event-hubs)


---

### Question 123
**Domain:** Design Identity, Governance, and Monitoring Solutions
**Subdomain:** Design governance and compliance solutions
**Type:** Multiple Choice

#### Question
Your organization is preparing a landing zone to move on-premises resources to Azure cloud. You are requested to recommend a hierarchical level where policies must be placed so that they are applied to all workloads that require the same security, compliance, connectivity, and feature settings.

You need to provide a recommendation.

What should you recommend?

#### Options
- Subscription
- Resources
- Management group
- Resource group

#### Correct Answer
- **Management group**

#### Explanation
You should recommend a management group level. A management group in Azure is a container for organizing subscriptions and applying policies across multiple subscriptions. Placing a policy at the management group level ensures that it is inherited by all the subscriptions and resources within those management groups. This is the recommended approach when you want consistent policies to apply to a set of resources across different subscriptions.

You should not recommend a resource group level. A resource group is a logical container for grouping related resources within a single subscription. While policies can be applied at the resource group level, this would be suitable when you want policies to apply to resources within a specific project or application, rather than across multiple workloads requiring the same settings.

You should not recommend a subscription level. A subscription is a basic unit of organization within Azure. Policies can be applied at the subscription level, but this might not be the best choice for managing workloads that require consistent settings across multiple subscriptions.

You should not recommend a resources level. Applying policies directly to individual resources (such as virtual machines, databases, etc.) is not efficient for managing a larger scale environment with uniform settings. This approach can lead to policy management complexity and difficulty in maintaining consistent settings.

**Reference:** [Microsoft Learn](https://learn.microsoft.com/en-us/azure/governance/management-groups/overview)


---

### Question 124
**Domain:** Design Identity, Governance, and Monitoring Solutions
**Subdomain:** Design a logging and monitoring solution
**Type:** Multiple Choice

#### Question
You are working for a global company operating in East US, Central US, North Europe, West Europe, East Asia, and Southeast Asia. The company plans to use the Azure Monitor solution to centralize log storage. In order to store the log data in the Azure Monitor solution, the company has the following requirements:

* Minimize administrative overhead.
* Minimize costs.
* Conform to specific regional compliance requirements.
* Provide regional data sovereignty.

You need to identify the minimum number of Log Analytics workspaces to fulfill the requirements.

How many workspaces should you identify?

#### Options
- Six
- Five
- One
- Three

#### Correct Answer
- **Three**

#### Explanation
You should recommend three Log Analytics workspaces. The six listed regions fall into three Azure geographies: United States (East US, Central US), Europe (North Europe, West Europe), and Asia Pacific (East Asia, Southeast Asia). A workspace per geography satisfies data sovereignty and regional compliance while keeping cost and administrative overhead low.

You should not recommend one log analytics workspace. Although creating one log analytics workspace would reduce the costs and administrative overhead, it would not satisfy the requirement for data sovereignty and regional compliance requirements, as you would require one workspace per geography.

You should not recommend either five or six log analytics workspaces. Although creating four or five log analytics workspaces would provide even more data sovereignty, it would increase the costs. Regarding users requiring a comprehensive data overview, the administrative overhead would also increase.

**Reference:** [Microsoft Learn](https://learn.microsoft.com/en-us/azure/azure-monitor/logs/workspace-design)


---

### Question 125
**Domain:** Design Identity, Governance, and Monitoring Solutions
**Subdomain:** Design an identity and access management solution
**Type:** Multiple Choice

#### Question
Company1 relies heavily on its Azure cloud infrastructure to deliver services to clients worldwide. As the company continues to grow, managing access to its critical resources, applications, and data has become a significant challenge.

You need to recommend a solution for controlling and monitoring access to important roles and enforcing just-in-time elevation of rights.

What should you recommend?

#### Options
- Access reviews
- Entitlement management
- Activity logs and auditing
- Privileged Identity Management (PIM)

#### Correct Answer
- **Privileged Identity Management (PIM)**

#### Explanation
You should recommend Privileged Identity Management (PIM). PIM is a feature within Microsoft Entra Identity Governance that specifically addresses the need to control and monitor access to important roles. It enforces just-in-time (JIT) elevation of privileges for users who need them to perform specific tasks. This aligns perfectly with the requirement to manage access to critical resources and ensure that privileges are granted only when necessary.

You should not recommend access reviews. While access reviews are important for periodically auditing and reviewing access to resources, they do not directly enforce JIT elevation of privileges, which is a specific requirement mentioned in the scenario.

You should not recommend entitlement management. Entitlement management helps to define and manage fine-grained access packages, but it may not be the primary choice for enforcing JIT elevation of privileges.

You should not recommend activity logs and auditing. While activity logs and auditing are essential for monitoring and maintaining security, they do not provide the same level of real-time control and enforcement of privileged access as PIM.

**Reference:** [Microsoft Learn](https://learn.microsoft.com/en-us/entra/id-governance/privileged-identity-management/pim-configure)


---

### Question 126
**Domain:** Design Identity, Governance, and Monitoring Solutions
**Subdomain:** Design an identity and access management solution
**Type:** Multiple Choice

#### Question
Your organization has one Azure subscription. You plan to deploy four SQL Server virtual machines (VMs) to that subscription. Developers and IT personnel must be able to connect to these VMs. However, only the IT personnel should have permission to modify or delete the SQL Server VMs.

You need to design an authorization strategy. Your solution should follow the principle of least privilege.

Which strategy should you use?

#### Options
- Deploy the SQL Server VMs in a separate resource group. Add the IT personnel to an IT group. Assign the Virtual Machine Contributor role to the IT group at the resource group level.
- Deploy the SQL Server VMs in an existing resource group. Add the IT personnel to an IT group. Assign the Virtual Machine Contributor role to the IT group at the subscription level.
- Deploy the SQL Server VMs in a separate resource group. Add the developers to a Developers group and the IT personnel to an IT group. Assign the Reader role to the Developers group and the Owner role to the IT group at the resource group level.
- Deploy the SQL Server VMs in an existing resource group. Add the developers to a Developers group and the IT personnel to an IT group. Assign the Reader role to the Developers group and the Owner role to the IT group at the resource group level.

#### Correct Answer
- **Deploy the SQL Server VMs in a separate resource group. Add the IT personnel to an IT group. Assign the Virtual Machine Contributor role to the IT group at the resource group level.**

#### Explanation
You should deploy the SQL Server VMs in a separate resource group and assign the Virtual Machine Contributor role to the IT group at that resource group scope. Permissions are inherited by the VMs in the resource group, letting IT manage (modify/delete) the VMs. Connecting to an existing VM does not require an Azure RBAC role on the resource, so developers do not need any role assignment for connectivity.

You should not assign the Developers group to the Reader role. This action would assign permissions to the developers that are not required to perform their task of connecting to the virtual machine, and would not conform to the principle of least privilege.

You should not deploy SQL Server VMs to the existing resource group and delegate permissions at the resource group level. If you take this action, permissions would be inherited by all objects in the resource group, not only by SQL Server VMs. This action would not conform to the principle of least privilege.

You should not assign the Virtual Machine Contributor role to the IT group at the subscription level. If you take this action, permissions would be inherited by all resource groups in the subscription and by all VMs. This action would assign the IT group permissions that are not required and would not conform to the principle of least privilege.

**Reference:** [Microsoft Learn](https://learn.microsoft.com/en-us/azure/role-based-access-control/built-in-roles#virtual-machine-contributor)


---

### Question 127
**Domain:** Design Identity, Governance, and Monitoring Solutions
**Subdomain:** Design governance and compliance solutions
**Type:** Dropdown / Matching

#### Question
Your Azure organizational hierarchy has one management group with two subscriptions and four resource groups in each subscription. You plan to implement Azure Policy to help you to organize and manage resources in your organization.

You plan to implement a custom solution to:

* Restrict the types of VMs that can be deployed.
* Deny the creation of resources without a Department tag when they are created.

You need to determine the minimum number of policy artifacts and policy assignments required.

What is the minimum number required in each scenario? To answer, select the appropriate options from the drop-down menus.

#### Dropdown Selections
- **Minimum number of custom policies required** ➔ `2`
- **Minimum number of policy assignments required** ➔ `1`

#### Explanation
Each of the two requirements is a distinct deny rule, so you need two custom policy definitions. To satisfy both with a single assignment, you group the two policy definitions into one initiative (policy set) definition and make one assignment at the management group level. Policies (and initiatives) assigned at the management group are inherited by all subscriptions and resource groups beneath it, so one assignment at the management group covers the whole hierarchy.

Minimum: two custom policy definitions (plus one initiative definition) and one assignment. A single policy definition should express a single effect; combining a deny-VM-SKU rule and a deny-if-no-tag rule into one definition is not the recommended pattern, which is why an initiative is used to keep the assignment count at one.

**Reference:** [Microsoft Learn](https://learn.microsoft.com/en-us/azure/governance/policy/overview#initiative-definition)


---

### Question 128
**Domain:** Design Identity, Governance, and Monitoring Solutions
**Subdomain:** Design governance and compliance solutions
**Type:** Multiple Choice

#### Question
Your company has an Azure subscription that includes multiple resource groups used to organize resources. Currently, you are not using resource tags.

You need to apply resource tags to resource groups, and ensure that the same tags apply to any resources that the group contains. When tags change at the resource group, the change should update its resources. You want to minimize the effort that is required to implement and maintain the solution.

What should you do?

#### Options
- Create and modify the tags at the resource group.
- Create an Azure Policy to apply specified tags from the resource group to resources, and link the policy to the resource group.
- Manually create and update tags individually for the resources.
- Create an Azure Policy to apply specified tags from the resource group to resources, and link the policy to the resource group. Initiate a remediation task when specified tags are added or updated at the resource group.

#### Correct Answer
- **Create an Azure Policy to apply specified tags from the resource group to resources, and link the policy to the resource group. Initiate a remediation task when specified tags are added or updated at the resource group.**

#### Explanation
You should create an Azure Policy to apply specified tags from the resource group to resources, link the policy to the resource group, and initiate a remediation task whenever tags are added or updated at the resource group. Resource tags applied at the resource group are not inherited by its resources. You can specify this action through Azure Policy. After applying the policy, or making changes to the resource group, you can run a remediation task to update the resources. Specified tags are also applied when you create a new resource, or update an existing resource. You can also use an Azure Policy to force resources to inherit tags from a subscription.

You should not just create and modify the tags at the resource group. The tags are not inherited by resources by default.

You should not manually create and update tags individually for the resource groups and resources. This would require the most effort to implement and maintain, and it would probably introduce inadvertent errors.

You should not create an Azure Policy to apply specified tags from the resource group to resources, and link the policy to the resource group without initiating a remediation process. Remediation is a required part of the process for existing resources. Specified tags are applied when you create a new resource, or update an existing resource.

**Reference:** [Microsoft Learn](https://learn.microsoft.com/en-us/azure/governance/policy/how-to/remediate-resources)


---

### Question 129
**Domain:** Design Identity, Governance, and Monitoring Solutions
**Subdomain:** Design governance and compliance solutions
**Type:** Yes/No Statements Table

#### Question
Your company has an Azure subscription that hosts most of its computing resources. The company is evaluating the possible use of resource tags to better organize and manage its resources.

You need to identify features and functionalities of using resource tags.

For each of the following statements, select Yes if the statement is true. Otherwise, select No.

#### Statements Evaluation
- **Statement:** You can use Azure Policy, PowerShell cmdlets, CLI commands, ARM templates, and Azure portal to apply tags.
  - **Answer:** `Yes`
  - **Rationale:** You can use Azure Policy, PowerShell cmdlets, CLI commands, ARM templates, and Azure portal to apply tags. Azure portal, PowerShell, and CLI are primarily used to make manual changes to resource tags. Azure Policy provides a way to automate the assignment and updating of tags.
- **Statement:** Tags applied at the resource group are automatically inherited when you create a new resource.
  - **Answer:** `No`
  - **Rationale:** Tags applied at the resource group are not automatically inherited when you create a new resource. No inheritance is supported by default, but it can be configured through Azure Policy.
- **Statement:** Tags can be applied at the resource group and individual resource hierarchical levels only.
  - **Answer:** `No`
  - **Rationale:** Tags cannot be applied at the resource group and individual resource hierarchical levels only. You can apply tags directly at the subscription level. You cannot apply tags at management group levels. You can apply Azure policies that manage resource tags at management group levels.

#### Explanation
You can use Azure Policy, PowerShell cmdlets, CLI commands, ARM templates, and Azure portal to apply tags. Azure portal, PowerShell, and CLI are primarily used to make manual changes to resource tags. Azure Policy provides a way to automate the assignment and updating of tags.

Tags applied at the resource group are not automatically inherited when you create a new resource. No inheritance is supported by default, but it can be configured through Azure Policy.

Tags cannot be applied at the resource group and individual resource hierarchical levels only. You can apply tags directly at the subscription level. You cannot apply tags at management group levels. You can apply Azure policies that manage resource tags at management group levels.

**Reference:** [Microsoft Learn](https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/tag-resources)


---

### Question 130
**Domain:** Design Identity, Governance, and Monitoring Solutions
**Subdomain:** Design an identity and access management solution
**Type:** Multiple Choice

#### Question
You are managing the Microsoft Entra environment for your organization.

You need to enable secure access for applications and services to Azure resources or applications.

Which account or identity should you create for this purpose?

#### Options
- User account
- group Managed Service account (gMSA)
- Service principal identity
- Device identity

#### Correct Answer
- **Service principal identity**

#### Explanation
You should create a service principal identity to enable secure access for applications and services to Azure resources or applications. A service principal is an application identity that you create in Microsoft Entra to provide secure authentication and authorization for applications and services. Service principals allow applications and services to interact with Azure resources using OAuth2 tokens while adhering to controlled access through roles and permissions. They are designed to represent applications, services, or automation tools and play a critical role in enabling secure and controlled access to Azure environment. Service principals are commonly used for scenarios like deploying resources through Azure Resource Manager (ARM) templates, granting permissions to applications, and enabling secure access to APIs and other Azure services.

You should not create a user account, a service account, or a device identity.

User accounts are intended for individual human users, group Managed Service accounts (gMSAs) refer to a traditional concept in on-premises Active Directory, and device identities primarily concern device management in Microsoft Entra ID, rather than authenticating applications or services.

**Reference:** [Microsoft Learn](https://learn.microsoft.com/en-us/entra/identity-platform/app-objects-and-service-principals)


---

### Question 131
**Domain:** Design Identity, Governance, and Monitoring Solutions
**Subdomain:** Design security and key management solutions
**Type:** Drag and Drop / Matching

#### Question
You are requested to implement a solution to manage sensitive information used across services and applications in your Azure environment.

You need to recommend a placement for the information within Azure Key Vault.

Which storage destination within Azure Key Vault should you recommend? To answer, drag the appropriate storage type to each information object. A storage type may be used once, more than once, or not at all.

#### Matching Pairs
- **Information about rotation configuration** ➔ `Tags`
- **RSA object** ➔ `Keys`
- **JSON object** ➔ `Secrets`
- **X.509 object** ➔ `Certificates`

#### Available Options
- Certificates
- Keys
- Secrets
- Tags

#### Explanation
To effectively manage information utilized across services and applications within your Azure environment, it is crucial to store each type of information in its appropriate supported storage destination within Azure Key Vault. The recommended storage types for each information object are:

* Information about rotation configuration: Tags. Tags are metadata labels that you can assign to resources in Azure, including items within Azure Key Vault. They provide a way to categorize, organize, and manage resources. For information related to rotation configurations, using tags can help you to label and identify items with specific rotation-related properties or metadata.
* RSA Object: Keys. Rivest-Shamir-Adleman (RSA) is a widely used asymmetric encryption algorithm that involves the use of public and private key pairs. If you have RSA objects that you need to manage, you should store them as cryptographic keys within Azure Key Vault. Keys in Azure Key Vault are used for internal encryption, decryption, and signing operations.
* JSON Object: Secrets. JavaScript Object Notation (JSON) is a data interchange format often used to store structured data. If you have sensitive information stored in JSON format, such as API keys, connection strings, or passwords, you should store them as secrets within Azure Key Vault. Secrets are encrypted and provide an additional layer of security compared to storing them directly in code or configuration files.
* X.509 object: Certificates. X.509 is a standard format for public key certificates, commonly used for secure communication and authentication. If you have X.509 certificates, such as SSL certificates for securing websites, you should store them as certificates within Azure Key Vault. Key Vault's certificate management capabilities allow you to securely store, manage, and use X.509 certificates within your applications and services.

**Reference:** [Microsoft Learn](https://learn.microsoft.com/en-us/azure/key-vault/general/about-keys-secrets-certificates)


---

### Question 132
**Domain:** Design Identity, Governance, and Monitoring Solutions
**Subdomain:** Design an identity and access management solution
**Type:** Multiple Select

#### Question
Your company has an on-premises Active Directory Domain Services (AD DS) domain that is synchronized to Microsoft Entra ID by using Microsoft Entra Connect. The domain is federated with Active Directory Federation Services (AD FS), and employee passwords are validated on-premises.

A partner company recently reported a breach in which employee credentials were stolen and reused several weeks later. You need to recommend a solution that meets the following requirements:

* Microsoft Entra ID identifies employee accounts whose credentials appear in publicly available breach data.
* Affected employees must resolve the compromise themselves at the next sign-in, without helpdesk involvement.

Which two actions should you perform? Each correct answer presents part of the solution.

#### Options
- Close the Remote Desktop Protocol (RDP) ports on the AD DS server.
- Enable Microsoft Entra Password Protection with a custom banned password list.
- Create a user risk-based Conditional Access policy.
- Create a sign-in risk-based Conditional Access policy.
- Enable password hash synchronization in Microsoft Entra Connect.

#### Correct Answer
- **Create a user risk-based Conditional Access policy.**
- **Enable password hash synchronization in Microsoft Entra Connect.**

#### Explanation
You should enable password hash synchronization in Microsoft Entra Connect. Leaked credential detection for hybrid accounts whose passwords are validated on-premises requires password hash synchronization. It can be enabled in addition to federation.

You should also create a user risk-based Conditional Access policy. Leaked credentials raise user risk, and the policy can require risk remediation at the next sign-in. User risk conditions require Microsoft Entra ID P2.

You should not close the RDP ports. This hardens remote administration but does not identify leaked credentials or remediate the affected account.

You should not enable Microsoft Entra Password Protection for this purpose. It blocks weak or banned passwords when passwords are set or changed, but it does not detect credentials exposed in external breach data.

You should not create a sign-in risk-based policy. Sign-in risk evaluates a specific authentication attempt; leaked credentials are a user risk detection and require user risk remediation.

**Reference:** [Microsoft Learn](https://learn.microsoft.com/en-us/entra/id-governance/identity-protection-configure)


---

### Question 133
**Domain:** Design Identity, Governance, and Monitoring Solutions
**Subdomain:** Design a logging and monitoring solution
**Type:** Multiple Choice

#### Question
You are designing a monitoring solution for a microservice solution hosted in an Azure Kubernetes Service (AKS) cluster.

You need to recommend a monitoring solution that meets the following requirements:

* Measure the memory consumption of cluster nodes.
* Monitor the health of pods and deployments.
* Create alerts when persistent volumes are more than 80% full.
* Visualize the metrics and dashboards within the Azure Portal.

What should you recommend?

#### Options
- Grafana
- VM insights
- Application Insights
- Container insights

#### Correct Answer
- **Container insights**

#### Explanation
You should recommend Container insights. You can use Container insights to monitor workloads running Kubernetes-based solutions in Azure. You can monitor and create alerts for all components in the cluster, including node memory and processor usage, pod and deployment health, and persistent volume usage. You can access the Container insights dashboards and metrics within the Azure Portal or integrate them with external monitoring tools, such as Prometheus or Grafana.

You should not recommend VM insights. You can use VM insights to monitor the performance and health of virtual machines (VMs). It should be possible to use VM insights to monitor some cluster nodes; however, it is not possible to monitor the internal resources in the cluster, like pods and persistent volumes.

You should not recommend Application Insights. You can use Application Insights to monitor application performance, error rate caused by exceptions, and how users interact with the application, including most-visited pages and other metrics.

You should not recommend Grafana. You can use Grafana to visualize and create dashboards based on multiple sources of metrics. You can use the Azure Monitor data source plugin to query data from Container insights to create custom dashboards. However, you cannot monitor an AKS cluster only with Grafana.

**Reference:** [Microsoft Learn](https://learn.microsoft.com/en-us/azure/azure-monitor/containers/container-insights-overview)


---

### Question 134
**Domain:** Design Identity, Governance, and Monitoring Solutions
**Subdomain:** Design an identity and access management solution
**Type:** Multiple Choice

#### Question
Your company has a Microsoft Entra infrastructure. Your company wants to securely share applications and services with guest users from another organization. The guest organization has an on-premises Active Directory (AD) domain but it does not support Microsoft Entra ID.

You need to implement a solution that gives guest users access to select resources while minimizing any additional user account management overhead. You want to minimize introducing any additional security risks.

What should you do?

#### Options
- Require the guest organization to implement Microsoft Entra ID.
- Configure synchronization between the guest organization's on-premises AD and your Microsoft Entra ID.
- Create a user account in your Microsoft Entra for each guest user.
- Implement business-to-business (B2B) collaboration.

#### Correct Answer
- **Implement business-to-business (B2B) collaboration.**

#### Explanation
You should implement business-to-business (B2B) collaboration. With B2B collaboration the guest users must have valid email addresses but an IT infrastructure for user management, such as Microsoft Entra, is not required. The guest organization has full responsibility for managing the external guest users. Your company will invite guest users through a simple invitation and redemption process. You configure conditional access policies to control access to your company content.

You should not create a user account in your Microsoft Entra for each guest user. This is not necessary and would require additional management overhead for your organization.

You should not configure synchronization between the guest organization's on-premises AD and your Microsoft Entra ID. There is no need for any type of synchronization between the organizations.

You should not require the guest organization to implement Microsoft Entra ID. This is not a requirement for the guest organization.

**Reference:** [Microsoft Learn](https://learn.microsoft.com/en-us/entra/external-id/what-is-b2b)


---

### Question 135
**Domain:** Design Identity, Governance, and Monitoring Solutions
**Subdomain:** Design governance and compliance solutions
**Type:** Multiple Choice

#### Question
Your company has an Azure subscription. The company wants a way to enforce organizational standards and to assess compliance at the subscription level and have the standards apply throughout the organization.

If compliance standards change, you should be able to update the standards and bring resources into compliance through bulk remediation. Remediation for new resources should be automatic.

You need to recommend a solution to meet these requirements.

What should you recommend?

#### Options
- Azure Managed Identities
- Azure Resource Manager (ARM) templates
- Azure Policy
- Azure Conditional Access

#### Correct Answer
- **Azure Policy**

#### Explanation
You should recommend Azure Policy. Azure Policy lets you enforce organizational standards at any point in your hierarchy, from management groups down to the individual resource level. You can define policies to implement governance for resource consistency and compliance. You can run remediation tasks on existing resources and implement automatic remediation for new resources.

You should not recommend Azure Conditional Access. Conditional Access is a feature of Microsoft Entra security that can be used to set requirements to allow or block access to resources.

You should not recommend Azure Managed Identities. Managed Identities is a special type of security principal that is used to manage secure access by Azure resources.

You should not recommend Azure Resource Manager (ARM) templates. ARM templates contain the definition for creating resource groups and resources, but are not used to manage compliance or remediate compliance issues.

**Reference:** [Microsoft Learn](https://learn.microsoft.com/en-us/azure/governance/policy/overview)


---

### Question 136
**Domain:** Design Identity, Governance, and Monitoring Solutions
**Subdomain:** Design security and key management solutions
**Type:** Multiple Select

#### Question
You are tasked with storing sensitive information in Azure Key Vault.

You need to identify which types of sensitive information can be stored in your Azure key vault.

Which three of the following can you store in your Azure key vault? Each correct answer provides a complete solution.

#### Options
- Blueprints
- Tags
- Keys
- Certificates
- Secrets

#### Correct Answer
- **Keys**
- **Certificates**
- **Secrets**

#### Explanation
The three types of sensitive information that you can store in your Azure Key Vault are:

* Secrets
* Certificates
* Keys

Azure Key Vault is a secure and centralized cloud service provided by Microsoft for managing cryptographic keys, secrets, and certificates used by cloud applications and services. It helps to safeguard sensitive information and provides secure access control.

Secrets are small-sized data elements, such as passwords, connection strings, and API keys. Storing secrets in Azure Key Vault ensures that sensitive data remains secure and accessible only to authorized users and applications.

Certificates are digital files that provide authentication and secure communication. Azure Key Vault allows you to store X.509 certificates and their private keys, enabling applications to securely access these certificates for authentication and encryption purposes.

Keys refer to cryptographic keys used for encryption, decryption, signing, and verification. Azure Key Vault supports the storage of keys, including symmetric keys and asymmetric key pairs. By storing keys in Azure Key Vault, you enhance the security of cryptographic operations.

Tags are not stored in Azure Key Vault. Instead, they are key-value pairs that you can assign to resources like Azure resources, resource groups, or other objects to help organize and categorize them.

Blueprints are not stored in Azure Key Vault. They are used to define a repeatable set of Azure resources that adhere to an organization's standards, patterns, and requirements.

**Reference:** [Microsoft Learn](https://learn.microsoft.com/en-us/azure/key-vault/general/about-keys-secrets-certificates)


---

### Question 137
**Domain:** Design Identity, Governance, and Monitoring Solutions
**Subdomain:** Design a logging and monitoring solution
**Type:** Yes/No Statements Table

#### Question
Your company wants to maintain Activity log and resource log information for auditing and static analysis. The data must remain available for up to six months.

You need to identify an appropriate storage and maintenance solution.

For each of the following statements, select Yes if the statement is true. Otherwise, select No.

#### Statements Evaluation
- **Statement:** You can use the Azure Monitor menu in the Azure portal to configure a diagnostic setting that archives the logs to a storage account.
  - **Answer:** `Yes`
  - **Rationale:** You can use the Azure Monitor menu in the Azure portal to configure a diagnostic setting whose destination is an Azure storage account, which is how logs are retained beyond the platform retention period. This is necessary because Activity log entries are only maintained for 90 days by Azure.
- **Statement:** You can create an Azure storage account for log storage in the same subscription as the resource sending the logs only.
  - **Answer:** `No`
  - **Rationale:** You can create an Azure storage account for log storage in the same subscription or a different subscription as the resource sending the logs. The user who configures the storage must have appropriate RBAC access to both subscriptions.
- **Statement:** You can configure Blob storage policies to require time-based retention.
  - **Answer:** `Yes`
  - **Rationale:** You can configure Blob storage policies to require time-based retention. This gives you a way to prevent data from being deleted or modified during the retention period.

#### Explanation
You can use the Azure Monitor menu in the Azure portal to configure a diagnostic setting whose destination is an Azure storage account, which is how logs are retained beyond the platform retention period. This is necessary because Activity log entries are only maintained for 90 days by Azure.

You can create an Azure storage account for log storage in the same subscription or a different subscription as the resource sending the logs. The user who configures the storage must have appropriate RBAC access to both subscriptions.

You can configure Blob storage policies to require time-based retention. This gives you a way to prevent data from being deleted or modified during the retention period.

**Reference:** [Microsoft Learn](https://learn.microsoft.com/en-us/azure/azure-monitor/essentials/diagnostic-settings)


---

### Question 138
**Domain:** Design Identity, Governance, and Monitoring Solutions
**Subdomain:** Design an identity and access management solution
**Type:** Dropdown / Matching

#### Question
Your company has a Microsoft Entra subscription. Recent security breaches have resulted from inappropriate or outdated access privilege assignments. You are designing access policies for different departments throughout your company to ease the problem. You want to implement a solution that:

* Provides permissions only when needed
* Lets you set start and end dates for permission assignments
* Sends notifications when privileged roles are activated

You need to identify the requirements for implementing this security design.

What should you recommend? To answer, select the appropriate options from the drop-down menus.

#### Dropdown Selections
- **Microsoft Entra ID minimum license** ➔ `P2`
- **Microsoft Entra feature** ➔ `Privileged Identity Management`

#### Explanation
You should recommend P2 as the Microsoft Entra ID license implementation of the Privileged Identity Management (PIM) feature. PIM lets you manage, control, and monitor access to important resources through features that include:

* Just-in-time (JIT) privileged access control
* Time-bound access to resources with start and end dates
* Required approval to activate privileged roles
* Notification when privileged roles are activated

This gives you the just-in-time and time-sensitive controls needed with the desired notifications. Full implementation of PIM requires Microsoft Entra P2.

You should not recommend Microsoft Entra ID Protection. Microsoft Entra ID Protection is used to help protect against identity-based threats, including monitoring for risks and implementing remediation steps.

You should not recommend Microsoft Entra Connect. Microsoft Entra Connect is used to provide synchronization between on-premises AD and Microsoft Entra ID.

You should not recommend Conditional Access. Conditional Access is used to block or allow access to domain resources based on qualifying criteria such as:
* User account or group membership
* Physical location
* Accessing device

Conditional access does not provide the types of protection needed. Conditional access can identify some risky behaviors and force actions such as password changes or multi-factor authentication.

**Reference:** [Microsoft Learn](https://learn.microsoft.com/en-us/entra/id-governance/privileged-identity-management/pim-configure)


---

### Question 139
**Domain:** Design Identity, Governance, and Monitoring Solutions
**Subdomain:** Design an identity and access management solution
**Type:** Multiple Choice

#### Question
Your organization has 10 Azure subscriptions, one for each branch office. Five offices are located in the eastern region, and the other five are located in the western region. Each region is grouped into its own management group. Each subscription has multiple resource groups, and each resource group has multiple resources. You want to ensure that only the IT personnel in each region have permission to create or modify the Azure resources for that region.

You need to assign role-based access control (RBAC) permissions to each office's IT staff. Your solution must require minimal maintenance.

Which scope should you apply the permissions to?

#### Options
- Subscription
- Resource
- Management group
- Resource group

#### Correct Answer
- **Management group**

#### Explanation
You should apply role-based access control (RBAC) permissions to the management group scope. Each region has its own management group containing five subscriptions, so a single assignment per management group covers all resources for that region and minimizes maintenance.

You should not apply RBAC permissions to the subscription scope. This would require you to manage RBAC permissions for 10 subscriptions instead of two management groups.

You should not apply RBAC permissions to the resource group scope. This would require you to manage multiple RBAC permission assignments for multiple resource groups across 10 subscriptions.

You should not apply RBAC permissions to the resource scope. This would require you to manage multiple RBAC permission assignments for every resource group across 10 subscriptions.

**Reference:** [Microsoft Learn](https://learn.microsoft.com/en-us/azure/role-based-access-control/scope-overview)


---

### Question 140
**Domain:** Design Identity, Governance, and Monitoring Solutions
**Subdomain:** Design a logging and monitoring solution
**Type:** Multiple Choice

#### Question
You are migrating your on-premises workloads running on Windows and Linux virtual machines to Azure. During the migration, the applications will run on a hybrid model, with some components running in both Azure and on-premises servers to ensure no downtime for the application during the migration process.

You need to design a monitoring strategy solution so that the logs and metrics are available in a centralized location in Azure. The logs should be stored for at least 18 months and must be easy to view and query.

Which solution should you configure?

#### Options
- Log Analytics
- A Storage Account
- Event Hubs

#### Correct Answer
- **Log Analytics**

#### Explanation
You should configure Log Analytics. It provides Kusto Query Language (KQL) to view and query logs and metrics, supports centralized collection from Azure and on-premises machines, and supports the required retention (with interactive plus archive/long-term retention configurable per table). Logs and metrics are collected using the Azure Monitor Agent (AMA), which is deployed to on-premises and Azure VMs and configured with data collection rules (DCRs). AMA replaced the legacy Log Analytics agent (MMA/OMS).

You should not use a storage account. It is cheap for raw log storage but cannot easily query the data and cannot directly collect VM logs without an agent.

You should not configure Event Hubs. It is for streaming to third-party tools and has short retention (seven days maximum on the standard tier), so logs cannot be viewed/queried directly.

**Reference:** [Microsoft Learn](https://learn.microsoft.com/en-us/azure/azure-monitor/logs/data-platform-logs)


---

### Question 141
**Domain:** Design Identity, Governance, and Monitoring Solutions
**Subdomain:** Design security and key management solutions
**Type:** Multiple Choice

#### Question
A development team is developing a web application App1, which is running on a Azure virtual machine (VM) VM1. App1 stores the data in Azure SQL database DB1. The source code of App1 is stored in a GitHub code repository. A recently performed Static Application Security Testing (SAST) has identified clear text SQL database connection string stored within the code.

You need to recommend a solution to remediate this vulnerability. The solution must minimize costs as well as administrative and development effort.

What should you recommend?

#### Options
- Azure Storage account
- Azure Key Vault
- BitLocker
- Microsoft Entra ID

#### Correct Answer
- **Azure Key Vault**

#### Explanation
You should recommend Azure Key Vault. Azure Key Vault is used to securely store secrets, SQL database connection strings, and certificates. Usually, multi-tier applications need to be authenticated to back-end services. Storing authentication secrets in clear text directly in the code is risky and vulnerable to be revealed to, and misused by, an ineligible user. It is good security practice to separate valuable secrets from application code. Azure Key Vault provides a solution to securely store and manage all the secrets your applications need. By using Azure Key Vault in this scenario you will follow the best security practice.

You should not recommend BitLocker. BitLocker is a solution to encrypt computer hard drives. It provides data protection in case a computer is lost, stolen, or inappropriately decommissioned. In this scenario, the source code is stored in source control solution GitHub. As the SQL database secure string is stored within the code, which is stored in the source code control solution GitHub, encrypting computer hard drives does not meet the requirement.

You should not recommend Microsoft Entra ID. Microsoft Entra is Microsoft's Cloud Identity and Access Management Solution. Although you could use Microsoft Entra to allow web applications to authenticate to SQL database, in this scenario, it would require additional administrative and development effort.

You should not recommend Azure Storage account. Azure Storage account provides a container to store data, such as files, queues, tables, and disks. The data can be accessed securely from anywhere around the world. However, Azure Storage account is not designed to hold an application's secrets. You should use Azure Key Vault in this scenario.

**Reference:** [Microsoft Learn](https://learn.microsoft.com/en-us/azure/key-vault/secrets/about-secrets)


---

### Question 142
**Domain:** Design Identity, Governance, and Monitoring Solutions
**Subdomain:** Design a logging and monitoring solution
**Type:** Multiple Choice

#### Question
You are designing a monitoring strategy for an Azure SQL Database. You want metrics to be collected from the database and provide performance reports on a dashboard.

You need to minimize programming effort.

What should you use?

#### Options
- Azure Event Hubs
- Azure Blob Storage
- Azure Table Storage
- Azure Log Analytics

#### Correct Answer
- **Azure Log Analytics**

#### Explanation
You should use Log Analytics in Azure Monitor. You can enable the diagnostic settings on the database and send the metrics to the Azure Log Analytics workspace. To generate the dashboard, you can enable Azure SQL Analytics in Azure Monitor. Azure SQL Analytics can consume the data from the Log Azure Log Analytics workspace to provide the performance reports on a dashboard without any programming efforts.

You should not use Azure Blob Storage. Blob Storage is used for storing large amounts of unstructured object data. Although you can enable the diagnostic settings on the database and send the metrics to the Azure Blob Storage, it would require lots of programming efforts to read the data from blob storage and generate the dashboard.

You should not use Azure Event Hubs. Event Hubs is a Big Data streaming platform. While it could be used by enabling the diagnostic settings on the database and send the metrics to the Azure Event Hubs. It is generally used to ship the data to third-party monitoring solutions or building custom logging and metrics solutions.

You should not use Azure Table Storage. Table Storage is used for storing structured NoSQL data in the cloud. Besides, it is not possible to send the diagnostics data directly to Table Storage.

**Reference:** [Microsoft Learn](https://learn.microsoft.com/en-us/azure/azure-monitor/insights/azure-sql)


---

### Question 143
**Domain:** Design Identity, Governance, and Monitoring Solutions
**Subdomain:** Design an identity and access management solution
**Type:** Multiple Choice

#### Question
You are requested to provide resources for a marketing campaign that internal users can use to self-service request without the need for approval. There is a requirement for access to expire within 30 days.

What should you recommend?

#### Options
- Access package
- Access review
- Lifecycle workflow
- Security group

#### Correct Answer
- **Access package**

#### Explanation
You should recommend an access package. An access package is designed to provide a curated set of resources that users can request access to without the need for approval. Access packages allow users to self-service their access requests based on predefined permissions and policies. Additionally, you can set an expiration period for the access, which aligns with the requirement for user access to expire within 30 days. This feature provides an efficient and controlled way to manage temporary access to resources for specific campaigns or projects.

You should not recommend security groups, access reviews, or lifecycle workflows. These are not directly aligned with the requirement of providing resources that internal users can self-service request without approval and with an expiration time frame.

Security groups are used for grouping users, computers, or other security principals for applying permissions, but they do not provide the self-service request or expiration features mentioned in the scenario.

Access reviews are processes used to periodically review and manage user access to resources, but they do not fit the scenario's requirement for self-service access and a specific 30-day expiration time frame.

Lifecycle workflows often involve processes related to the creation, modification, or deletion of identities or resources, but they might not be suitable for managing temporary access requests and their expiration periods as described in the scenario.

**Reference:** [Microsoft Learn](https://learn.microsoft.com/en-us/entra/id-governance/entitlement-management-overview)


---

### Question 144
**Domain:** Design Identity, Governance, and Monitoring Solutions
**Subdomain:** Design a logging and monitoring solution
**Type:** Multiple Choice

#### Question
Your company collects tenant, subscription, and resource data using Azure Monitor. The company also wants to stream this data because it is collected in real time, to a third-party monitoring solution for additional analysis.

You need to recommend the most effective method to stream monitoring data to a third-party tool.

What should you recommend?

#### Options
- Azure Event Hub
- Azure Event Grid
- Azure Service Bus
- Azure Logic Apps

#### Correct Answer
- **Azure Event Hub**

#### Explanation
You should recommend an Azure Event Hub solution. Event Hubs are designed to support telemetry and distributed data streaming and are the best fit to a real-time streaming solution. You would need to create an Event Hubs namespace and event hub as your monitoring data destination. You can configure an external data consumer.

You should not recommend Azure Event Grid as a solution. Azure Event Grid is designed to react to status changes and lets you integrate third-party tools to react to events without having to continually poll for event status.

You should not recommend Azure Service Bus. Azure Service Bus is an enterprise messaging system and is most commonly used to support order processing and financial transaction applications.

You should not recommend Azure Logic Apps as a real-time solution. If you had a situation where you could not directly stream to an event hub, you could have the data transferred to blob storage and then use a time-triggered Logic App to get the data from blob storage and push it as a message to the event hub.

**Reference:** [Microsoft Learn](https://learn.microsoft.com/en-us/azure/azure-monitor/essentials/stream-monitoring-data-event-hubs)


---

### Question 145
**Domain:** Design Identity, Governance, and Monitoring Solutions
**Subdomain:** Design an identity and access management solution
**Type:** Multiple Choice

#### Question
You are implementing a conditional access solution in your Microsoft Entra environment. During the pilot phase of the implementation, the Security Operation Team (SOC) raised concerns regarding the delay between modifications in user conditions and the enforcement of policy changes.

You need to recommend a mechanism that enables a conversation between the token issuer (Microsoft Entra ID) and the relying party (enlightened app) to address policy violations or security issues.

What should you recommend?

#### Options
- Two-factor authentication (2FA)
- OpenID Connect (OIDC)
- OAuth 2.0 Authorization Code Flow
- Continuous Access Evaluation (CAE)

#### Correct Answer
- **Continuous Access Evaluation (CAE)**

#### Explanation
You should recommend Continuous Access Evaluation (CAE). The scenario discusses implementing a conditional access solution in a Microsoft Entra environment, with concerns raised by the Security Operations Team about delays between user condition modifications and the enforcement of policy changes. The situation calls for a mechanism that facilitates a "conversation" between the token issuer (Microsoft Entra ID) and the relying party (enlightened app) to handle policy violations or security issues. CAE is the most appropriate mechanism for this purpose. CAE is designed to provide real-time or near real-time evaluation of access conditions and allows for ongoing monitoring and assessment of user and device conditions, ensuring that policy changes are promptly enforced. If conditions change for a user (as expressed in the scenario), CAE can trigger an evaluation and interaction between the token issuer and the relying party to address potential policy violations or security concerns.

You should not recommend Two-factor authentication (2FA), OAuth 2.0 Authorization Code Flow, or OpenID Connect (OIDC). These are authentication and authorization mechanisms, but they do not specifically address the continuous monitoring and evaluation aspect required by the scenario.

**Reference:** [Microsoft Learn](https://learn.microsoft.com/en-us/entra/identity/conditional-access/concept-continuous-access-evaluation)


---

### Question 146
**Domain:** Design Identity, Governance, and Monitoring Solutions
**Subdomain:** Design a logging and monitoring solution
**Type:** Multiple Choice

#### Question
You are an administrator of an engineering company, which recently migrated its on-premises web application WebApp1 to Azure. After migration, you receive complaints that WebApp1 is behaving unpredictably: at peak times it is unresponsive and at all other times its resources are not being utilized.

You need to recommend a solution to identify the focus of the instability issue for WebApp1.

Which Azure Insights solution should you recommend as a starting point for the investigation?

#### Options
- Network insights
- VM insights
- Application Insights
- Storage insights

#### Correct Answer
- **Application Insights**

#### Explanation
You should recommend Application Insights as the investigation starting point. It is an application performance management and runtime diagnostics tool that helps detect web-application anomalies and pinpoint the service or dependency causing performance/stability issues.

You should not recommend Network Insights as an investigation starting point. Network Insights is designed to get a view of the deployed network resources. It can help to trace network performance and connectivity issues. In this scenario, Network Insights could be used as the next step of the investigation. However, the investigation's starting point should be Application Insights.

You should not recommend Storage insights as an investigation starting point. Storage insights is designed to get a view of the deployed storage accounts, get information about storage performance, capacity, and availability. In this scenario, Storage insights could be one of the next steps in the investigation chain. However, the investigation's starting point should be Application Insights.

You should not recommend VM insights as an investigation starting point. VM insights is one of the Azure Insights tools to measure performance and health of your virtual machines and virtual machine scale sets. VM insights could be the following diagnostic step in resolving the issue. However, the investigation's starting point should be Application Insights.

**Reference:** [Microsoft Learn](https://learn.microsoft.com/en-us/azure/azure-monitor/app/app-insights-overview)


---

### Question 147
**Domain:** Design Identity, Governance, and Monitoring Solutions
**Subdomain:** Design governance and compliance solutions
**Type:** Multiple Choice

#### Question
You decide to use tagging to organize your Azure resources.

You need to make sure that new resources are tagged as soon as possible and that manual tagging is not required.

What should you do?

#### Options
- Write an Azure CLI script to tag every new resource once a day.
- Add tags through the Azure portal.
- Write a PowerShell script to tag everything once a week.
- Create an Azure policy to apply tagging when new resources are created.

#### Correct Answer
- **Create an Azure policy to apply tagging when new resources are created.**

#### Explanation
You should create an Azure policy to apply tagging when you create new resources. An Azure policy can be predefined and applied to all new resources.

You should not write a PowerShell script to tag everything once a week. PowerShell is a method that can apply tagging, but it uses a manual procedure.

You should not write an Azure CLI script to tag every new resource once a day. Azure CLI is a method that can apply tagging, but it uses a manual procedure.

You should not add tags through the Azure portal. Although you can add tags in the portal after creating a resource, it is still a manual process.

**Reference:** [Microsoft Learn](https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/tag-policies)


---

### Question 148
**Domain:** Design Identity, Governance, and Monitoring Solutions
**Subdomain:** Design an identity and access management solution
**Type:** Multiple Choice

#### Question
You administer a Microsoft Entra tenant. To reduce the work your IT department spends on customers, the company wants its customers to register themselves, maintain their own profiles, and reset their own passwords, without an administrator creating any account.

You need to recommend a solution to meet the requirement.

What should you recommend?

#### Options
- Microsoft Entra External ID
- Microsoft Entra B2B direct connect
- Self-service password reset in the workforce tenant
- Microsoft Entra B2B collaboration

#### Correct Answer
- **Microsoft Entra External ID**

#### Explanation
You should recommend Microsoft Entra External ID configured. It is the customer identity and access management offering for new deployments, and in an external tenant, separate from the workforce tenant, it provides self-service sign-up, sign-in, profile maintenance, and password reset for consumers.

You should not recommend Microsoft Entra B2B collaboration. It invites users from another organization into your directory as guests so that they can reach your resources. Each guest arrives through an invitation or a redemption flow tied to an existing account, which is not consumer self-registration.

You should not recommend Microsoft Entra B2B direct connect. It establishes mutual trust with another Microsoft Entra organization, currently for capabilities such as Microsoft Teams shared channels. It presumes the external users already have an organizational identity, so it cannot serve customers who have none.

You should not recommend self-service password reset in the workforce tenant. It lets your own employees reset their passwords, and it acts on accounts that already exist in the workforce directory rather than allowing customers to create them.

**Reference:** [Microsoft Learn](https://learn.microsoft.com/en-us/entra/external-id/customers/overview-customers-ciam)


---

### Question 149
**Domain:** Design Identity, Governance, and Monitoring Solutions
**Subdomain:** Design a logging and monitoring solution
**Type:** Multiple Choice

#### Question
You are designing a monitoring solution for a gaming website hosted in an Azure Web App.

You have the following monitoring requirements:

* Track how often users return to the website in a specified time period.
* Measure how specific events influence user activities.
* View user activity by region.

You need to provide a solution that minimizes administrative effort.

Which monitoring solution should you use?

#### Options
- Azure Monitor Alerts
- Time Series Insights environments
- Application Insights
- Azure AI Services

#### Correct Answer
- **Application Insights**

#### Explanation
You should use Application Insights as it includes a retention feature that enables tracking of user behavior. You can configure custom events so that you can analyze user reactions. You can query user activity by time range as well as by filtering according to region or country.

You should not use Azure Monitor Alerts. Data collected by Azure Monitor helps in detecting potential problems with the application or infrastructure. You can configure alerts for notifying your operation teams before end users face issues. It cannot track the user activity of your application.

You should not use Time Services Insights environments. This service provides fully managed IoT analytics solution in the cloud. It provides visualization to your IoT events, but does not track events back to user satisfaction.

You should not use Azure AI Services. These services consist of APIs and images that developers can use to integrate popular artificial intelligence (AI) features into their applications. They do not provide monitoring functions.

**Reference:** [Microsoft Learn](https://learn.microsoft.com/en-us/azure/azure-monitor/app/usage-retention)


---

### Question 150
**Domain:** Design Identity, Governance, and Monitoring Solutions
**Subdomain:** Design a logging and monitoring solution
**Type:** Multiple Choice

#### Question
A recent audit of your Microsoft Entra environment has resulted in a requirement to retain your activity logs for 15 years.

You need to meet the requirement, while minimizing complexity and costs.

What should you recommend?

#### Options
- Azure Event Hubs
- Azure storage account
- Azure Log Analytics workspace
- Azure Service Bus

#### Correct Answer
- **Azure storage account**

#### Explanation
You should recommend an Azure storage account. Azure storage accounts provide a cost-effective and relatively simple way to retain logs for a long period while minimizing complexity. You can configure your logs to be stored in an Azure storage account, which offers durable and scalable storage capabilities. Azure Storage provides a straightforward solution for long-term retention without the need for complex configurations or additional services. For the specific scenario of retaining logs for a long duration with minimal complexity and costs, an Azure storage account is the recommended choice.

You should not recommend an Azure Log Analytics workspace. An Azure Log Analytics workspace is a service designed for collecting, analyzing, and visualizing data from your resources. While it provides powerful capabilities for log analysis and monitoring, it is not suited for long-term storage.

You should not recommend Azure Event Hubs. Azure Event Hubs is a scalable event streaming platform that can ingest and process large volumes of data in real-time. While it provides flexibility, it is more geared towards real-time data streaming rather than long-term storage.

You should not recommend Azure Service Bus. Azure Service Bus is a messaging service designed for reliable communication between different applications and services. It provides features like queues and topics for asynchronous messaging patterns. However, for the specific requirement of retaining activity logs for 15 years while minimizing complexity and costs, Azure Service Bus is not the most suitable choice.

**Reference:** [Microsoft Learn](https://learn.microsoft.com/en-us/entra/identity/monitoring-health/howto-archive-activity-logs)


---

### Question 151
**Domain:** Design Identity, Governance, and Monitoring Solutions
**Subdomain:** Design an identity and access management solution
**Type:** Multiple Choice

#### Question
Your company has a Microsoft Entra tenant named Company.com. The company has a Marketing, Finance and Research department.

You are designing multi-factor authentication (MFA) for Company.com.

You need to ensure that MFA is only implemented for users in the Research department.

Which requirement should you include in the design?

#### Options
- Implement Microsoft Entra ID Protection.
- Create a conditional access policy.
- Configure authentication methods.
- Implement Microsoft Entra Privileged Identity Management (PIM).

#### Correct Answer
- **Create a conditional access policy.**

#### Explanation
You should include a requirement to create a conditional access policy. A conditional access policy is used to grant access to cloud apps. A conditional access policy can be targeted to users and groups. One of the access controls that you can require in a conditional access policy is the use of multi-factor authentication (MFA).

You should not include a requirement to configure authentication methods. In authentication methods, you can configure custom smart lockout, custom banned passwords and password protection for Active Directory Domain Services. You cannot enable or configure MFA in authentication methods.

You should not include a requirement to implement Microsoft Entra ID Protection. Microsoft Entra ID Protection is used to detect and prevent risky sign-ins. One of the Microsoft Entra ID Protection features is the ability to require MFA for sign-in, but only if sign-in is detected as risky.

You should not implement Microsoft Entra Privileged Identity Management (PIM). PIM is used for just-in-time activation of privileged roles. You can use PIM to require MFA if a user wants to activate privileged role membership. PIM cannot be used to require MFA at user sign-in.

**Reference:** [Microsoft Learn](https://learn.microsoft.com/en-us/entra/identity/conditional-access/howto-conditional-access-policy-all-users-mfa)


---

### Question 152
**Domain:** Design Identity, Governance, and Monitoring Solutions
**Subdomain:** Design an identity and access management solution
**Type:** Multiple Choice

#### Question
You are designing a hybrid identity solution for your organization. It consists of an on-premises Active Directory (AD) domain and a Microsoft Entra tenant. Your solution must meet the following requirements:

* Allow a user who logs in to their on-premises account to automatically authenticate in Microsoft Entra to access Azure services.
* Minimize administrative effort to deploy and maintain.

You need to set up authentication.

Which mechanism should you use?

#### Options
- Federation without password hash sync
- Single sign-on (SSO) with password hash sync
- Single sign-on (SSO) with pass-through authentication
- Federation with password hash sync

#### Correct Answer
- **Single sign-on (SSO) with password hash sync**

#### Explanation
You should use single sign-on (SSO) with password hash sync. This requires the least amount of administrative effort for deployment and maintenance. The on-premises AD domain services stores the user password as a hash. AD Connect then retrieves the user password hash and hashes that hash. It then sends the second hash to Microsoft Entra ID. When the user logs in to Microsoft Entra ID, Microsoft Entra ID compares the password hashes.

You should not use SSO with pass-through authentication. This requires you to install a pass-through authentication agent on an on-premises server.

You should not use federation with or without password hash sync. With this authentication method, Microsoft Entra delegates authentication to a separate trusted authentication system, such as AD Federation Services (FS). This requires you to deploy and maintain additional software.

**Reference:** [Microsoft Learn](https://learn.microsoft.com/en-us/entra/identity/hybrid/connect/whatis-hybrid-identity)


---

### Question 153
**Domain:** Design Identity, Governance, and Monitoring Solutions
**Subdomain:** Design an identity and access management solution
**Type:** Multiple Select

#### Question
Your company has an on-premises Active Directory (AD) forest and a Microsoft Entra ID P1 tenant. All Microsoft Entra users are assigned a P1 license. You plan to have users use the same usernames and passwords for on-premises and Microsoft Entra authentication. Password changes are currently managed through the helpdesk to ensure that passwords remain synchronized.

Your company is considering deploying Microsoft Entra Connect on the on-premises network. You need to identify features from this action that will help to reduce the management overhead for your network infrastructure and helpdesk personnel.

Which two features could you use? Each correct answer presents a complete solution.

#### Options
- Privileged Identity Management (PIM)
- Self-service password reset
- Identity Protection
- Periodic access review
- Password writeback

#### Correct Answer
- **Self-service password reset**
- **Password writeback**

#### Explanation
You could use self-service password reset (SSPR) or password writeback to help reduce the helpdesk personnel's workload. Both rely on Microsoft Entra Connect to synchronize between your on-premises AD and Microsoft Entra ID. SSPR lets users reset their own password changes. Password writeback ensures cloud password changes are written back to on-premises AD. SSPR and password writeback are available with the Microsoft Entra ID P1 license already assigned in this scenario.

You should not use periodic access review. It does not require Microsoft Entra Connect and does not reduce the helpdesk password workload. Access review is an aid to manage group memberships, access to enterprise applications, and role assignments.

You should not use Privileged Identity Management (PIM). It is not specific to hybrid Entra Connect and provides just-in-time privileged access. PIM requires Microsoft Entra ID P2. It provides the following features:
* Just-in-time (JIT) privileged access control
* Time-bound access to resources with start and end dates
* Required approval to activate privileged roles
* Notification when privileged roles are activated
* Access audit history

You should not use Identity Protection. It detects and remediates identity risk and requires Microsoft Entra ID P2, and is not specific to Entra Connect.

**Reference:** [Microsoft Learn](https://learn.microsoft.com/en-us/entra/identity/authentication/concept-sspr-writeback)


---

### Question 154
**Domain:** Design Identity, Governance, and Monitoring Solutions
**Subdomain:** Design governance and compliance solutions
**Type:** Multiple Choice

#### Question
Your company has an Azure subscription with Microsoft Entra ID. Your company's development team members will provision Azure VMs to support special projects.

You need to recommend a solution that meets the following additional requirements:

* Limit VMs to specific sizes only.
* Limit VMs to specific regions.

What should you use?

#### Options
- Azure Resource Tags
- Azure Role-Based Access Control (Azure RBAC)
- Azure Conditional Access
- Azure Policy

#### Correct Answer
- **Azure Policy**

#### Explanation
You should use Azure Policy to meet the requirements. Azure Policy lets you enforce organizational standards at any point in your hierarchy, from management groups down to the individual resource level. You can define policies to implement governance for resource consistency, including which VMs can be created, and in which regions.

You should not use Azure Resource Tags. Resource Tags is a way to organize and manage resources, and it does not control resource governance or the types of resources that can be created. Common uses of resource tags include implementing support for regulatory governance, workload optimization, and cost controls.

You should not use Azure Role-Based Access Control (RBAC). Azure RBAC roles give you control over what you can do when you access a resource, but they are not used to impose resource consistency for creating resources.

You should not use Azure Conditional Access. Conditional Access is a feature of Microsoft Entra security that can be used to set requirements to allow or block access to resources.

**Reference:** [Microsoft Learn](https://learn.microsoft.com/en-us/azure/governance/policy/overview)


---

### Question 155
**Domain:** Design Identity, Governance, and Monitoring Solutions
**Subdomain:** Design an identity and access management solution
**Type:** Multiple Choice

#### Question
You create an Azure subscription for your company. You plan to create a resource group for each department in your company. You want to allow only members of a particular department to create resources in the resource group assigned to their department.

You need to identify an Azure feature to support this design.

Which Azure feature should you use?

#### Options
- Policies
- Locks
- Initiatives
- Role-based access control (RBAC)

#### Correct Answer
- **Role-based access control (RBAC)**

#### Explanation
You should use Role-based access control (RBAC). RBAC helps you control which users or groups have access to resources, and which permissions they have on those resources. You can apply RBAC access to a management group, a subscription, a resource group, or a resource. Permissions are inherited from higher scopes to lower scopes.

You should not use locks. Locks allow you to prevent resources from being modified or deleted. This helps you prevent unexpected or accidental changes. The two types of lock levels are CanNotDelete (Delete in the Portal) and ReadOnly (Read-only in the Portal).

You should not use policies. Policies allow you to configure rules that control the types of Azure resources that are allowed in a subscription or resource group. For example, you can prevent VMs of a certain size from being deployed.

You should not use initiatives. Initiatives are groups of policies. Initiatives allow you to manage a set of policies together.

**Reference:** [Microsoft Learn](https://learn.microsoft.com/en-us/azure/role-based-access-control/overview)


---

### Question 156
**Domain:** Design Identity, Governance, and Monitoring Solutions
**Subdomain:** Design a logging and monitoring solution
**Type:** Yes/No Statements Table

#### Question
You are designing a monitoring strategy of user sign-ins for a web application.

You need to evaluate Microsoft Entra activity logs as a possible solution.

For each of the following statements, select Yes if the statement is true. Otherwise, select No.

#### Statements Evaluation
- **Statement:** You can configure Microsoft Entra sign-in logs to be routed to an Azure Storage account for archiving.
  - **Answer:** `Yes`
  - **Rationale:** You can configure Microsoft Entra sign-in logs to be routed to an Azure Storage account for archiving, which is useful to retain events beyond the default retention period.
- **Statement:** An Azure Log Analytics workspace is required to enable sending Microsoft Entra activity logs to Azure Monitor Logs.
  - **Answer:** `Yes`
  - **Rationale:** An Azure Log Analytics workspace is required to enable sending Microsoft Entra activity logs to Azure Monitor Logs. Sending Microsoft Entra activity logs to Azure Monitor Logs requires a Log Analytics workspace as the destination. Note, however, that a Log Analytics workspace is only required for the Azure Monitor Logs destination; routing the same logs to an Azure Storage account (archive) or to an Azure Event Hub does not require a workspace.
- **Statement:** Microsoft Entra Password Protection is a prerequisite to enable Microsoft Entra activity logs.
  - **Answer:** `No`
  - **Rationale:** Microsoft Entra Password Protection is not a prerequisite to enable Microsoft Entra activity logs; it is used to enforce password policies and is independent of activity logging.

#### Explanation
You can configure Microsoft Entra sign-in logs to be routed to an Azure Storage account for archiving, which is useful to retain events beyond the default retention period.

An Azure Log Analytics workspace is required to enable sending Microsoft Entra activity logs to Azure Monitor Logs. Sending Microsoft Entra activity logs to Azure Monitor Logs requires a Log Analytics workspace as the destination. Note, however, that a Log Analytics workspace is only required for the Azure Monitor Logs destination; routing the same logs to an Azure Storage account (archive) or to an Azure Event Hub does not require a workspace.

Microsoft Entra Password Protection is not a prerequisite to enable Microsoft Entra activity logs; it is used to enforce password policies and is independent of activity logging.

**Reference:** [Microsoft Learn](https://learn.microsoft.com/en-us/entra/identity/monitoring-health/howto-integrate-activity-logs-with-log-analytics)


---

### Question 157: Solution Evaluation - Department Cost Reporting & Resource Organization
- **Domain:** Design Identity, Governance, and Monitoring Solutions
- **Subdomain:** Design governance and compliance solutions
- **Type:** Case Study / Solution Evaluation Series

#### 📋 Scenario:
Your organization is moving its business operations to Azure. Your company is organized into three departments that will deploy Azure app services and databases. A fourth department is responsible for internal operations and will deploy resources as necessary to support those activities.

Your company wants to be cost-conscious in its move to the cloud, and exercise cost and budget controls at the department level. The company plans to use the Azure Resource Usage and Rate Card APIs to collect billing data for analysis.

Initially, you set up your company's Azure with one subscription.

You need to design a solution for cost reporting by department. The solution should follow best practices for organizing resources and should minimize the effort required to maintain the solution.

*(This case study contains a series of questions that present the same scenario. Each question in the series contains a unique solution that might meet the stated goals. Some question sets might have more than one correct solution, while others might not have a correct solution. Note: You cannot go back or review questions of this type on the actual certification exam.)*

---

### Part 1:
- **Proposed Solution:** You create a separate subscription for each department, and use resource groups to organize resources by project.
- **Question:** Does this solution meet the goal?
- **Answer:** **`No`**
- 💡 **Explanation:** This solution does not meet the goal. Creating a subscription per department is a valid organizing pattern in the Cloud Adoption Framework and does roll costs up per department. It is not the best fit here because the requirement is cost reporting at department level with minimal maintenance across a single existing subscription, and because organizing the resources by project inside those subscriptions still provides no department attribution for resources shared between projects.

---

### Part 2:
- **Proposed Solution:** You create a separate resource group for each department to host that department's resources, and limit access to the resource group through Azure role-based access control (Azure RBAC).
- **Question:** Does this solution meet the goal?
- **Answer:** **`No`**
- 💡 **Explanation:** The solution does not meet the goal. You should not create a separate resource group for each department to host that department's resources, and limit access to the resource group through Azure RBAC. Organizing by department is an acceptable way of organizing resources, but it does nothing toward retrieving and reporting cost accounting and budget information. Azure RBAC is used to control and manage access to resources, but it does not retrieve the information you need.

---

### Part 3:
- **Proposed Solution:** You create a separate resource group for each workload, grouping resources that share a lifecycle, and tag the resources with department and billing code.
- **Question:** Does this solution meet the goal?
- **Answer:** **`Yes`**
- 💡 **Explanation:** This solution meets the goal. Microsoft's Cloud Adoption Framework recommends placing resources that share a lifecycle in the same resource group, and using tags to capture information such as department and billing code. Cost Management then uses those tags to produce cost views per department, which is what this scenario requires; the resource group layout itself does not drive cost reporting.

**Reference:** [Microsoft Learn](https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ready/azure-best-practices/resource-tagging)


---

### Question 158
**Domain:** Design Identity, Governance, and Monitoring Solutions
**Subdomain:** Design security and key management solutions
**Type:** Multiple Choice

#### Question
Your organization plans on moving all its organizational data from on-premises to the cloud. Your Data Protection Officer (DPO) requested the highest possible level of security for data encryption keys is implemented.

You need to recommend a solution that guarantees a high level of tamper resistance and protection against attacks for cryptographic material, ensuring that stored keys never leave the storage boundary.

Which solution should you recommend?

#### Options
- Key Vault
- Trusted Platform Modules (TPM)
- Hardware Security Module (HSM)
- Encrypted file system

#### Correct Answer
- **Hardware Security Module (HSM)**

#### Explanation
You should recommend a Hardware Security Module (HSM) is a specialized hardware device designed to provide secure storage and management of cryptographic keys. HSMs are known for their high level of tamper resistance and protection against attacks. They store keys in a dedicated hardware component, ensuring that the keys never leave the secure boundary of the HSM. This is particularly crucial for meeting the requirement of not letting cryptographic material leave the storage boundary. HSMs offer a robust combination of physical security, tamper resistance, and cryptographic operations, making them a suitable choice for scenarios that demand the highest level of security.

You should not recommend encrypted file systems. Encrypted file systems are designed to protect data at rest on storage devices by encrypting the data stored in files. However, they do not inherently provide the level of protection needed for cryptographic keys. Additionally, encrypted file systems focus on protecting the data itself rather than the keys used to encrypt the data. Since the question specifies the need to protect cryptographic material and ensure it does not leave the storage boundary, encrypted file systems are not the most suitable option.

You should not recommend trusted platform modules (TPMs). TPMs are hardware chips on computer motherboards that provide a secure environment for cryptographic operations. While TPMs can securely store keys, they are typically more focused on local device security and platform integrity. They might not be as specialized as HSMs in offering the highest level of protection and tamper resistance for cryptographic keys.

You should not recommend Key Vaults. Key vaults are cloud-based services designed to securely manage cryptographic keys and secrets. While they offer good security for key management, they are not necessarily hardware based like HSMs. Additionally, the question specifies the need for cryptographic material to never leave the storage boundary, and key vaults could potentially involve data leaving the immediate storage boundary for cloud-based management unless they utilize HSMs.

**Reference:** [Microsoft Learn](https://learn.microsoft.com/en-us/azure/key-vault/managed-hsm/overview)


---

### Question 159
**Domain:** Design Identity, Governance, and Monitoring Solutions
**Subdomain:** Design a logging and monitoring solution
**Type:** Drag and Drop / Matching

#### Question
You are planning the migration of a large on-premises IT system to Azure. You want to ensure that proper alerting and metric-collection systems are configured for all resources once they are deployed and in production.

To ensure that the correct Azure functionality is used within the overall monitoring infrastructure, you need to identify the most appropriate feature or tool for each requirement.

Which solution should you use for each scenario? To answer, drag the appropriate tool or feature to each requirement. A tool or feature may be used once, more than once, or not at all.

#### Matching Pairs
- **You need to create standardized deployments of Azure resources that can ensure that standard alerting rules are put into place.** ➔ `Resource Manager Templates`
- **You need a service to centralize all metrics from Azure resources and create alerts based on those metrics.** ➔ `Azure Monitor`
- **You need subscription-level events that occur within Azure and that can be used to identify changes that are made to resources.** ➔ `Activity Logs`
- **You need to do manual analysis of collected Azure log data using the Kusto query language.** ➔ `Log Analytics Workspace`

#### Available Options
- Activity Logs
- Azure Monitor
- Azure Dashboards
- Log Analytics Workspace
- Resource Manager Templates
- Smart Groups

#### Explanation
You should use Azure Resource Manager (ARM) templates to support standardized deployments. ARM templates are scripts that can be authored to deploy nearly any resource type within Azure. Deploying a standardized alert configuration as part of the resource at the time of original deployment is a powerful automation feature of Azure.

You should use Azure Monitor to centralize all metrics from Azure resources and create alerts based on those metrics. Azure Monitor collects all log and metric data that is collected within Azure. This provides you with a centralized location for collecting the data.

You should use Activity logs to obtain subscription-level events that occur within Azure and that can be used to identify changes that are made to resources. Core Azure alerts are surfaced through Activity Logs. These include service-level alerts, in addition to logging all activities made on resources themselves, and support alerts at the subscription scope.

You should use Log Analytics workspaces to do manual analysis of collected Azure log data using the Kusto query language. This is a powerful tool that is useful for performing a detailed analysis of historical metrics or activities for systems within Azure.

**Reference:** [Microsoft Learn](https://learn.microsoft.com/en-us/azure/azure-monitor/overview)


---

### Question 160
**Domain:** Design Identity, Governance, and Monitoring Solutions
**Subdomain:** Design an identity and access management solution
**Type:** Multiple Choice

#### Question
Your company has a Microsoft Entra ID P2 environment that hosts over 10,000 licensed users. The domain supports over 100 business-critical applications. Your company is concerned about its ability to recognize and respond to external threats for the applications.

You need to recommend a solution that supports identifying sign-in risks and provides remediation strategies.

What should you recommend?

#### Options
- Azure Policies
- Microsoft Entra Connect Health
- Microsoft Entra ID Protection
- Microsoft Entra Privileged Identity Management (PIM)

#### Correct Answer
- **Microsoft Entra ID Protection**

#### Explanation
You should recommend Microsoft Entra ID Protection. Identity Protection enables an organization to:
* Automate detection and remediation of identity-based risks
* Investigate risks based on portal data
* Export risk data for additional analysis

You can use Identity Protection to detect risks like anonymous IP address use for a user or leaked credentials, and implement remediation steps. Full implementation of Identity Protection requires a Microsoft Entra ID P2 license.

You should not recommend Microsoft Entra Privileged Identity Management (PIM). PIM lets you manage, control, and monitor access to important resources through features that include:
* Just-in-time (JIT) privileged access control
* Time-bound access to resources with start and end dates
* Required approval to activate privileged roles
* Notification when privileged roles are activated
* Access audit history

PIM does not provide for the protection and remediation needed in this scenario.

You should not recommend Microsoft Entra Connect Health. Connect Health is not a security monitoring and remediation solution, though it provides monitoring of your on-premises identity infrastructure when supporting both an on-premises AD and Microsoft Entra ID. It provides information such as performance monitoring and usage analytics.

You should not recommend Azure Policies. Azure Policy is used to ensure and assess compliance to defined standards. This can include regulatory compliance, resource consistency, security, costs, and so forth. Azure Policy works by comparing resource properties with policy definitions that act as business rules.

**Reference:** [Microsoft Learn](https://learn.microsoft.com/en-us/entra/id-governance/identity-protection-configure)


---

### Question 161
**Domain:** Design Identity, Governance, and Monitoring Solutions
**Subdomain:** Design an identity and access management solution
**Type:** Multiple Choice

#### Question
You have a hybrid identity environment with Microsoft Entra ID and an on-premises Active Directory Domain Services deployment. Your company has several internal web applications that use Windows Integrated Authentication. Remote employees must access these applications over the internet without connection software deployed on their devices and without inbound ports opened in the perimeter firewall. The applications must provide single sign-on.

You need to recommend a solution that meets these requirements.

What should you recommend?

#### Options
- Azure VPN Gateway
- Microsoft Entra application proxy
- Microsoft Entra Private Access
- Microsoft Entra pass-through authentication

#### Correct Answer
- **Microsoft Entra application proxy**

#### Explanation
You should recommend Microsoft Entra application proxy. Application proxy publishes internal web applications through a private network connector, so remote clients reach them over the internet without a client on the device and without inbound firewall ports. It uses Kerberos Constrained Delegation to provide single sign-on to applications secured with Windows Integrated Authentication.

You should not recommend Azure VPN Gateway. Azure VPN Gateway sends encrypted traffic between an Azure virtual network and on-premises networks, but it requires client software on the device to establish the tunnel. It does not provide application-level single sign-on for web applications that use Windows Integrated Authentication.

You should not recommend Microsoft Entra pass-through authentication. Pass-through authentication validates user passwords directly against on-premises Active Directory when users sign in to Microsoft Entra ID. It does not publish on-premises applications or provide remote access to them.

You should not recommend Microsoft Entra Private Access. Private Access builds on application proxy to reach private resources, but it requires the Global Secure Access client on each device. That client requirement conflicts with the constraint that no connection software is deployed on employee devices.

**Reference:** [Microsoft Learn](https://learn.microsoft.com/en-us/entra/identity/app-proxy/what-is-application-proxy)


---

### Question 162
**Domain:** Design Identity, Governance, and Monitoring Solutions
**Subdomain:** Design an identity and access management solution
**Type:** Multiple Choice

#### Question
Your organization has four Azure subscriptions, one for each branch office. Each subscription has multiple resource groups, and each resource group has multiple resources. You want to ensure that only the IT personnel in each branch office have permission to create or modify the Azure resources for that office.

You need to assign role-based access control (RBAC) permissions to the IT personnel. Your solution must require minimal maintenance.

Which scope should you apply the permissions to?

#### Options
- Management group
- Subscription
- Resource group
- Resource

#### Correct Answer
- **Subscription**

#### Explanation
You should apply RBAC permissions to the subscription scope. Since each office maps to its own subscription, an assignment at the subscription applies to that office's resources only and requires the least ongoing maintenance.

You should not apply RBAC permissions to the management group scope. A management group allows you to group multiple subscriptions for RBAC assignment. In this scenario, RBAC permissions should be assigned to each subscription, not across multiple subscriptions.

You should not apply RBAC permissions to the resource group scope. This would require you to manage multiple RBAC permission assignments for multiple resource groups in a single subscription.

You should not apply RBAC permissions to the resource scope. This would require you to manage multiple RBAC permission assignments for every resource group in a subscription.

**Reference:** [Microsoft Learn](https://learn.microsoft.com/en-us/azure/role-based-access-control/scope-overview)


---

### Question 163
**Domain:** Design Identity, Governance, and Monitoring Solutions
**Subdomain:** Design an identity and access management solution
**Type:** Multiple Select

#### Question
A medium-sized company is using Microsoft Entra ID to control access to their applications and services that are deployed in Azure. A recent security audit shows that the Global Administrator group is populated with people who do not need such broad access to the resources.

You need to restrict the resources appropriately. In addition, you want to be able to grant elevated access only for specific periods of time, such as for only an hour or a day or for situations when a person needs temporary access for a specific task.

Which two actions should you perform? Each correct answer presents part of the solution.

#### Options
- Add conditional access policies to your current access restrictions.
- Use managed identities to further restrict access to the resources.
- Assign more granular roles to the administrators according to their functions.
- Use Privileged Identity Management (PIM) to create additional rules for access.

#### Correct Answer
- **Assign more granular roles to the administrators according to their functions.**
- **Use Privileged Identity Management (PIM) to create additional rules for access.**

#### Explanation
You should assign more granular roles to the administrators according to their functions. Unless your organization is very small, the administrators are responsible for specific aspects of a system or only for certain resources. The tasks that are performed by particular administrators should map directly to their roles. You should always assign the least possible privilege that allows users to perform their assigned tasks.

You should also use Privileged Identity Management (PIM) to create additional rules for access, including just-in-time (JIT) privileged access to Azure resources. This includes activating access for only a specific length of time, such as one hour or one day.

You should not use managed identities to further restrict access to the resources. Managed identities provide access for resources, not for users. For example, if an application needs to retrieve secrets from a key vault, it can use its managed identity to retrieve a token.

You should not add conditional access policies to your current access restrictions. Conditional access policies are intended to address issues that are related to remote access and bring your own device (BYOD) workplaces. You can, for example, allow or block access for certain locations or device types.

**Reference:** [Microsoft Learn](https://learn.microsoft.com/en-us/entra/id-governance/privileged-identity-management/pim-configure)
